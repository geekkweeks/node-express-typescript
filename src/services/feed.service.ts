import { Client } from '../models/client.model'
import { db } from '../utils/db'
import { logger } from '../utils/logger'
import { Feed } from '../models/feed.model'
import { AuthMetric, DataItem } from '../models/dataRow.model'
import CONFIG from '../config/environment'
import { Client as ElasticSearchClient } from '@elastic/elasticsearch'
import { SourceMeta } from '../models/source_meta.model'
import { Relations } from '../models/relations.model'
import { string } from 'joi/lib'

export const getFeedService = async () => {
  try {
    const result: Feed[] = []
    const query = `SELECT
                a.stream_id id,
                a.stream_title title,
                a.stream_topic topic,
                a.stream_keywords keywords,
                null age,
                DATE_FORMAT(a.stream_user_updated, '%Y-%m-%d %H:%i:%s') analysed_date_time,
                d.client_code client_code,
                d.client_name client_name,
                lower(b.analyse_tone) sentiment,
                null conversation,
                a.stream_detail detail,
                f.auth_edu education,
                a.stream_img_url image_url,
                f.auth_location location,
                f.auth_gender gender,
                a.stream_media_id media_id,
                lower(e.media_name) media_name,
                'Aggregator' reviewer,
                'Aggregator' reviewer_username,
                DATE_FORMAT(a.stream_user_created, '%Y-%m-%d %H:%i:%s') source_date_time,
                a.stream_link_url source_url,
                f.auth_img_url avatar_url,
                f.auth_name display_name,
                f.auth_user author_name,
                a.stream_engage engage,
                a.stream_status status,
                a.stream_metric stream_source_meta,
                c.auth_id auth_id,
                c.auth_user auth_user_name,
                c.auth_link_url auth_link_url,
                c.auth_name auth_display_name,
                c.auth_img_url avatar_url,
                c.auth_metric auth_metric,
                a.stream_edited edited,
                cl.cluster_title subject
            FROM tbl_stream_content_migration a
            LEFT JOIN tbl_stream_analysis b on a.stream_id = b.analyse_stream_id
            LEFT JOIN tbl_stream_author c on a.stream_auth_id = c.auth_id
            LEFT JOIN trendata_creds.tbl_client d on b.analyse_client_id = d.client_id
            LEFT JOIN trendata_creds.tbl_media e on a.stream_media_id = e.media_id
            LEFT JOIN tbl_stream_author f on a.stream_auth_id = f.auth_id
            LEFT JOIN tbl_stream_analysis g on a.stream_id = g.analyse_stream_id
            LEFT JOIN trendata_creds.tbl_stream_cluster cl on g.analyse_cluster_id = cl.cluster_id
            LIMIT 15000`
    const [rows] = await db.query(query)
    const list = rows as DataItem[] | []
    const uniqueIdList = list
      .filter((obj, index, self) => index === self.findIndex((t) => t.id === obj.id))
      .map((obj) => obj.id)

    for (const x in uniqueIdList) {
      const feedList = list.filter((f) => f.id === uniqueIdList[x])
      const uniqueClients = feedList
        .filter((obj, index, self) => index === self.findIndex((t) => t.id === obj.id))
        .map((obj) => {
          return {
            code: obj?.client_code,
            name: obj?.client_name,
            sentiment: obj?.sentiment
          } as Client
        })
      const data = feedList[0]
      let isManually = false
      if (
        data?.media_name === 'Forum' ||
        data?.media_name === 'Blogs' ||
        data?.media_name === 'Reddit' ||
        data?.media_name === 'LinkedIn'
      ) {
        isManually = true
      }

      // Parse the JSON string in stream_source_meta
      let streamSourceMeta: SourceMeta | null = null
      if (data?.stream_source_meta) {
        try {
          streamSourceMeta = JSON.parse(data.stream_source_meta) as SourceMeta
        } catch (error) {
          console.error('Error parsing stream_source_meta:', error)
        }
      }

      let authMetric: AuthMetric | null = null
      if (data?.auth_metric_str) {
        try {
          authMetric = JSON.parse(data.auth_metric_str) as AuthMetric
        } catch (error) {
          console.error('Error parsing stream_source_meta:', error)
        }
      }

      const feedData = {
        id: data?.id,
        age: data?.age,
        analysed_date_time: data?.analysed_date_time,
        clients: uniqueClients,
        conversation: data?.conversation,
        detail: data?.detail,
        edited: data.edited ?? 0,
        education: data?.education,
        feed_title: data?.title,
        gender: data?.gender ?? null,
        group: data.group ?? null,
        image_url: data?.image_url,
        is_manually: isManually,
        keywords: data?.keywords ? JSON.parse(data?.keywords) : [],
        location: data?.location ?? null,
        media_name: data?.media_name,
        engage: data?.engage ?? 0,
        metric: {
          comments: streamSourceMeta?.comments ?? 0,
          favorites: streamSourceMeta?.favourites ?? 0,
          impressions: streamSourceMeta?.impressions ?? 0,
          likes: streamSourceMeta?.likes ?? 0,
          quotes: streamSourceMeta?.quotes ?? 0,
          replies: streamSourceMeta?.replies ?? 0,
          retweets: streamSourceMeta?.retweets ?? 0,
          shares: streamSourceMeta?.shares ?? 0,
          views: streamSourceMeta?.views ?? 0
        },
        reach: {
          potential: 0,
          score: 0
        },
        reviewer: data?.reviewer,
        reviewer_username: data?.reviewer,
        source_date_time: data?.source_date_time,
        source_url: data?.source_url,
        status: data?.status,
        stream_resource: null,
        subject: data?.subject ?? null,
        talk_about: data?.talk_about ?? null,
        topic: data?.topic,
        user: {
          id: data?.auth_id,
          user_name: data?.author_name,
          user_url: data?.auth_link_url,
          display_name: data?.auth_display_name,
          avatar_url: data?.avatar_url,
          favourites: authMetric?.favourites ?? 0,
          followers: authMetric?.followers ?? 0, // TODO: always return 0
          following: authMetric?.following ?? 0,
          friends: authMetric?.friends ?? 0,
          likes: authMetric?.likes ?? 0
        }
      } as Feed

      // Stream relation
      const queryRelation = `SELECT b.stream_source source, b.stream_target target, b.stream_relation relation from tbl_stream_content a JOIN tbl_stream_relation b on a.stream_id = b.stream_id WHERE a.stream_id = ${feedData?.id}`
      const [relations] = await db.query(queryRelation)
      const relationList = relations as Relations[] | []

      if (relationList.length > 0) {
        feedData.relations = relationList
      }

      result.push(feedData)
    }
    return result
  } catch (error) {
    logger.error('Error adding feed service:', error)
  }
}

export const bulkInsertFeed = async () => {
  // Initialize Elasticsearch client
  const client = new ElasticSearchClient({ node: CONFIG.elasticSearchAPI })
  const feeds = await getFeedService()

  // if feed has no records then stop the process
  if (!feeds || feeds.length === 0) return

  // Prepare bulk insert actions
  const body = feeds.flatMap((doc) => [{ index: { _index: 'feed_management', _id: doc.id } }, doc])

  try {
    const bulkResponse = await client.bulk({ refresh: true, body })
    // Check for errors

    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter((item) => item.index && item.index.error)
      console.log('Bulk insert encountered errors:', erroredDocuments)
    } else {
      console.log('Bulk insert successful:', bulkResponse)

      const idsString = feeds.map((feed) => `'${feed.id}'`).join(', ')

      // Delete data from table
      await db.execute(`DELETE FROM tbl_stream_content_migration WHERE stream_id IN (${idsString})`)
    }
  } catch (error) {
    logger.error('Error bulk inserting feed:', error)
  }
}
