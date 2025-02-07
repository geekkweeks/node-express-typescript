import { Client } from './client.model'
import { Metric } from './metric.model'
import { Reach } from './reach.mode'
import { Relations } from './relations.model'
import { User } from './user.model'

export interface Feed {
  id: String | null
  clients: Client[] | []
  user: User | null
  age: Number | null
  feed_title: String | null
  source_url: String | null
  image_url: String | null
  conversation: String | null
  detail: String | null
  education: String | null
  gender: String | null
  group: String | null
  location: String | null
  engage: Number | null
  media_name: String | null
  metric: Metric | null
  reach: Reach | null
  relations: Relations[] | []
  subject: String | null
  reviewer: String | null
  reviewer_username: String | null
  source_date_time: String | null
  status: String | null
  talk_about: String | null
  total_comments: Number | 0
  total_dislikes: Number | 0
  total_favourites: Number | 0
  total_likes: Number | 0
  total_quote_retweet: Number | 0
  total_reply: Number | 0
  total_retweet: Number | 0
  total_shares: Number | 0
  total_views: Number | 0
  analysed_date_time: String | 0
  is_manually: Boolean | false
  edited: number | 0
  keywords: String[] | []
  stream_resource: String | null
  topic: String | null
}
