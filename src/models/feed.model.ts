import { Client } from './client.model'
import { Metric } from './metric.model'
import { User } from './user.model'

export interface Feed {
  id: string
  clients: Client[]
  user: User
  age: number
  feed_title: string
  source_url: string
  image_url: string
  conversation: string
  detail: string
  education: string
  gender: string
  group: string
  issue: string
  location: string
  media_name: string
  metric: Metric
  subject: string
  keyword: string
  reviewer: string
  source_date_time: string
  status: string
  talk_about: string
  total_comments: number
  total_dislikes: number
  total_favourites: number
  total_likes: number
  total_quote_retweet: number
  total_reply: number
  total_retweet: number
  total_shares: number
  total_views: number
  is_analysed: boolean
  analysed_date_time: string
}
