import { Client } from '../models/client.model'
import { db } from '../utils/db'
import { logger } from '../utils/logger'
import { Feed } from '../models/feed.model'
import { DataItem } from '../models/dataRow.model'
import CONFIG from '../config/environment'
import { Client as ElasticSearchClient } from '@elastic/elasticsearch'

export const getFeedService = async () => {
  try {
    const result: Feed[] = []
    const query = `SELECT 
		  COALESCE(a.stream_source_id, UUID()) id, 
		  src_title,
          set_title subject,
          ent_word keyword,
          a.stream_user_age age, 
          DATE_FORMAT(a. stream_user_updater, '%Y-%m-%d %T') analysed_date_time,
          b.code client_code,
          b.name client_name,
          lower(a.stream_source_tone) sentiment,
          stream_conversation conversation,
          a.stream_source_detail detail,
          a.stream_user_edu education,
          a.stream_source_title feed_title,
          LOWER(a.stream_user_gender) gender,
          LOWER(a.stream_user_group) 'group',
          a.stream_source_image image_url,
          a.stream_issue issue,
          a.stream_source_loc location,
          lower(C.media_name) media_name,
          d.user_login reviewer,
          DATE_FORMAT(a.stream_source_date, '%Y-%m-%d %T')  source_date_time,
          a.stream_source_url source_url,
          a.stream_talk_about talk_about,
          a.stream_source_image avatar_url,
          CASE
                WHEN C.media_name = 'Twitter' THEN a.stream_user_alias
                WHEN C.media_name = 'Instagram' THEN a.stream_user_name
                WHEN C.media_name = 'Facebook' THEN a.stream_user_name
                WHEN C.media_name = 'TikTok' THEN a.stream_user_name
                WHEN C.media_name = 'YouTube' THEN a.stream_user_name
                WHEN C.media_name = 'Forum' THEN a.stream_user_name
                WHEN C.media_name = 'LinkedIn' THEN a.stream_user_name
                WHEN C.media_name = 'Blogs' THEN a.stream_user_name
                ELSE a.stream_user_name
          END AS name,
          CASE
                WHEN C.media_name = 'Twitter' THEN a.stream_user_name
                WHEN C.media_name = 'Instagram' THEN a.stream_user_alias
                WHEN C.media_name = 'Facebook' THEN a.stream_user_alias
                WHEN C.media_name = 'TikTok' THEN a.stream_user_alias
                WHEN C.media_name = 'YouTube' THEN a.stream_user_alias
                WHEN C.media_name = 'Forum' THEN a.stream_user_alias
                WHEN C.media_name = 'LinkedIn' THEN a.stream_user_alias
                WHEN C.media_name = 'Blogs' THEN a.stream_user_alias
                ELSE a.stream_user_name
          END AS display_name,
          stream_source_engage engage,
          stream_source_meta,
          CASE 
			WHEN stream_analysed = 'simple' AND stream_status = 'Active' THEN 'false'
            WHEN stream_analysed = 'simple' AND stream_status = 'Spam' THEN 'false'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Active' THEN 'true'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Spam' THEN 'true'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Deleted' THEN 'true'
            WHEN stream_analysed = 'simple' AND stream_status = 'Deleted' THEN 'true'
            else 'false'
	      END is_analysed,
          CASE 
			WHEN stream_analysed = 'simple' AND stream_status = 'Active' THEN 'unanalysed'
            WHEN stream_analysed = 'simple' AND stream_status = 'Spam' THEN 'spam'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Active' THEN 'analysed'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Spam' THEN 'spam'
            WHEN stream_analysed = 'advanced' AND stream_status = 'Deleted' THEN 'deleted'
            WHEN stream_analysed = 'simple' AND stream_status = 'Deleted' THEN 'deleted'
            else 'unanalysed'
	      END status
          FROM tbl_feeds_backup a
          LEFT JOIN (SELECT bc.id, bc.code, ab.client_id, bc.name FROM tbl_client ab JOIN client bc on ab.client_name = bc.name) b on a.stream_client_id = b.client_id
          LEFT JOIN tbl_media c on a.stream_media_id = c.media_id
          LEFT JOIN tbl_user d on a.stream_user_updater = d.user_id
          LEFT JOIN trendata_creds.tbl_social_search x on a.stream_src_id = x.src_id AND a.stream_cluster_id = x.src_cluster_id AND a.stream_client_id = x.src_client_id
          LEFT JOIN trendata_creds.tbl_social_entity y on x.src_id = y.ent_src_id and a.stream_media_id = y.ent_media_id
          LEFT JOIN trendata_creds.tbl_social_cluster z on x.src_cluster_id = z.set_id AND a.stream_client_id = z.set_client_id 
          WHERE b.code is not null
          ORDER BY a.stream_source_date DESC
          LIMIT 50000`
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
            id: obj?.client_code,
            name: obj?.client_name,
            sentiment: obj?.sentiment
          } as Client
        })
      const data = feedList[0]

      let isManually = true
      if (
        data?.media_name === 'Forum' ||
        data?.media_name === 'Blogs' ||
        data?.media_name === 'Reddit' ||
        data?.media_name === 'LinkedIn'
      ) {
        isManually = true
      }
      result.push({
        id: data.id,
        age: data.age,
        clients: uniqueClients,
        feed_title: data?.feed_title,
        source_url: data?.source_url,
        image_url: data?.image_url,
        conversation: data?.conversation,
        detail: data?.detail,
        education: data?.education,
        gender: data?.gender,
        group: data.group,
        issue: data?.issue,
        location: data?.location,
        media_name: data?.media_name,
        subject: data?.subject,
        keyword: data?.keyword,
        reviewer: data?.reviewer,
        source_date_time: data?.source_date_time,
        status: data?.status,
        talk_about: data?.talk_about,
        total_comments: data?.stream_source_meta?.comments ?? 0,
        total_dislikes: 0,
        total_favourites: data?.stream_source_meta?.favourites ?? 0,
        total_likes: data?.stream_source_meta?.likes ?? 0,
        total_quote_retweet: 0,
        total_reply: 0,
        total_retweet: data?.stream_source_meta?.retweets ?? 0,
        total_shares: data?.stream_source_meta?.shares ?? 0,
        total_views: data?.stream_source_meta?.views ?? 0,
        is_analysed: data?.is_analysed,
        analysed_date_time: data?.analysed_date_time,
        metric: {
          engagement: data?.engage ?? 0,
          engangement_rate: 0,
          reach: 0,
          retweet: 0
        },
        is_manually: isManually,
        user: {
          id: '',
          display_name: data?.display_name,
          name: data?.name,
          avatar_url: data?.avatar_url
        }
      } as Feed)
    }

    console.log('🚀 ~ addFeedService ~ result:', result[0])
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
  console.log('🚀 ~ bulkInsertFeed ~ body:', body)
  try {
    const bulkResponse = await client.bulk({ refresh: true, body })
    // Check for errors
    console.log('🚀 ~ bulkInsertFeed ~ k:', bulkResponse)
    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter((item) => item.index && item.index.error)
      console.log('Bulk insert encountered errors:', erroredDocuments)
    } else {
      console.log('Bulk insert successful:', bulkResponse)

      const idsString = feeds.map((feed) => `'${feed.id}'`).join(', ')
      console.log('🚀 ~ bulkInsertFeed ~ idsString:', idsString)

      // Delete data from table
      await db.execute(`DELETE FROM tbl_feeds_backup WHERE stream_source_id IN (${idsString})`)
    }
  } catch (error) {
    logger.error('Error bulk inserting feed:', error)
  }
}
