import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL

const client = new MongoClient(url, { useNewUrlParser: true })

async function connectDb() {
  try {
    await client.connect()

    // Confirm connection
    await client.db('admin').command({ ping: 1 })
    console.log('Connected to DB successfully')
  } catch (e) {
    console.error(e)
    // If there is a problem, close connection to db
    client.close()
  }
}

export { client, connectDb }
