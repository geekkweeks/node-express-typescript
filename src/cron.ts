import cron from 'node-cron'
import { bulkInsertFeed } from './services/feed.service'
import { logger } from './utils/logger'

// Define a cron job to run every minute
cron.schedule('*/3 * * * *', async () => {
  console.log('Cron job running...')

  try {
    // Example: Fetch records from a MySQL table
    logger.info(`Jobs started: ${new Date().toISOString()}`)
    const feeds = await bulkInsertFeed()
    logger.info(`Jobs finished: ${new Date().toISOString()}`)
  } catch (error) {
    logger.error('Error executing cron job:', error)
  }
})
