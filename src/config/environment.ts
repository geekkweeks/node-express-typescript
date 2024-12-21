import 'dotenv/config'

const CONFIG = {
  db: process.env.DB,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  elasticSearchAPI: process.env.ELASTICSEARCH_API
}

export default CONFIG
