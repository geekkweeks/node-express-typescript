// Connect to MySQL database
import mysql from 'mysql2/promise'
import config from '../config/environment'

export const db = mysql.createPool({
  host: `${config.dbHost}`,
  port: Number(`${config.dbPort}`),
  user: `${config.dbUser}`,
  password: `${config.dbPassword}`,
  database: `${config.dbName}`
})
