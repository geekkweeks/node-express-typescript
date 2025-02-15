import fs from 'fs'
import { NextFunction, Request, Response, Router } from 'express'
import { Client, ClientOptions } from '@elastic/elasticsearch'
import CONFIG from '../config/environment'

export const MigrationRouter = Router()

MigrationRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await exportData()
  res.status(200).send({ data: 'Health' })
})

const cloneIndex = async () => {
  const indexName = 'feed_management'
  const LOCAL_ES = 'http://localhost:9500' // Local Elasticsearch
  const REMOTE_ES = 'http://localhost:9220' // SSH Forwarded Elasticsearch Port

  const localClient = new Client({ node: LOCAL_ES })
  const remoteClient = new Client({
    node: REMOTE_ES,
    auth: { username: CONFIG.elasticUsername as string, password: CONFIG.elasticPassword as string }
  })
  try {
    // Step 1: Fetch all documents from the local server
    const localDocs = await localClient.search({
      index: indexName,
      size: 5000, // Adjust this if needed
      scroll: '1m',
      body: {
        query: { match_all: {} }
      }
    })

    const docs = localDocs.hits.hits
    console.log('🚀 ~ cloneIndex ~ docs:', docs)

    // Step 2: Insert each document into the remote server
    const bulkBody = docs.flatMap((doc) => [{ index: { _index: indexName, _id: doc._id } }, doc._source])

    const bulkResponse = await remoteClient.bulk({
      body: bulkBody,
      refresh: true
    })

    if (bulkResponse.errors) {
      console.error('Bulk insert had errors:', bulkResponse)
    } else {
      console.log(`Successfully cloned ${docs.length} documents to remote index: ${indexName}`)
    }
  } catch (error) {
    console.error('Error cloning index:', error)
  }
}

const reindexData = async () => {
  const destinationClient = new Client({
    node: 'http://localhost:9220',
    auth: { username: CONFIG.elasticUsername as string, password: CONFIG.elasticPassword as string }
  })
  await destinationClient.reindex({
    body: {
      source: {
        remote: {
          host: 'http://localhost:9500'
        },
        index: 'feed_management'
      },
      dest: {
        index: 'feed_management'
      }
    }
  })
  console.log('Reindexing completed!')
}

const exportData = async () => {
  const sourceClient = new Client({ node: 'http://localhost:9500' as string })
  let result = await sourceClient.search({
    index: 'feed_management',
    scroll: '1m',
    size: 10000,
    body: { query: { match_all: {} } }
  })

  const allData = []

  while (result.hits.hits.length) {
    allData.push(...result.hits.hits)
    result = await sourceClient.scroll({
      scroll_id: result._scroll_id,
      scroll: '1m'
    })
  }

  fs.writeFileSync('data.json', JSON.stringify(allData, null, 2))
  console.log('Export completed!')
}
