import { Client } from './client.model'
import { Metric } from './metric.model'
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
  issue: String | null
  location: String | null
  media_name: String | null
  metric: Metric | null
  subject: String | null
  keyword: String | null
  reviewer: String | null
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
  is_analysed: Boolean | false
  analysed_date_time: String | 0
  is_manually: Boolean | false
}
