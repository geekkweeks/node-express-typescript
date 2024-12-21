import { SourceMeta } from './source_meta.model'

export interface DataItem {
  id: String
  stream_source_meta: SourceMeta | null
  src_title: String | null
  subject: String | null
  keyword: String | null
  age: String | null
  analysed_date_time: String | null
  client_code: String | null
  client_name: String | null
  sentiment: String | null
  conversation: String | null
  detail: String | null
  education: String | null
  feed_title: String | null
  gender: String | null
  group: String | null
  image_url: String | null
  issue: String | null
  location: String | null
  media_name: String | null
  reviewer: String | null
  source_date_time: String
  source_url: String | null
  talk_about: String | null
  avatar_url: String | null
  name: String | null
  display_name: String | null
  engage: Number | null
  is_analysed: Boolean | null
  status: String | null
}
