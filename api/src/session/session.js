import { client } from './../db.js'

const session = client.db('test').collection('session')
// session.createIndex({ sessionToken: 1 })

export { session }
