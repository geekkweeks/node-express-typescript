import 'dotenv/config'

const CONFIG = {
  db: process.env.DB,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: Number(process.env.DB_PORT ?? 3306),
  elasticSearchAPI: process.env.ELASTICSEARCH_API,
  elasticUsername: process.env.ELASTIC_USERNAME,
  elasticPassword: process.env.ELASTIC_PASSWORD
}

export default CONFIG
