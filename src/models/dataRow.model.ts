import { SourceMeta } from './source_meta.model'

export interface DataItem {
  id: String
  stream_source_meta: string | null
  title: String | null
  topic: String | null
  subject: String | null
  keywords: string | null
  age: String | null
  analysed_date_time: String | null
  client_code: String | null
  client_name: String | null
  sentiment: String | null
  conversation: String | null
  detail: String | null
  education: String | null
  gender: String | null
  group: String | null
  image_url: String | null
  location: String | null
  media_id: String | null
  media_name: String | null
  reviewer: String | null
  reviewer_username: String | null
  source_date_time: String
  source_url: String | null
  talk_about: String | null
  author_name: String | null
  display_name: String | null
  engage: Number | null
  status: String | null
  auth_id: String | null
  auth_user_name: string | 0
  auth_link_url: String | null
  auth_display_name: String | null
  avatar_url: String | null
  //   auth_metric: {
  //     favourites: Number | 0
  //     followers: Number | 0
  //     following: Number | 0
  //     friends: Number | 0
  //     likes: Number | 0
  //   }
  auth_metric_str: string | null
  edited: Number | 0
}

export interface AuthMetric {
  favourites: Number | 0
  followers: Number | 0
  following: Number | 0
  friends: Number | 0
  likes: Number | 0
}
