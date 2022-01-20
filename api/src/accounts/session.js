import { randomBytes } from 'crypto'
import { session } from './../session/session.js'

async function createSession(userId, connection) {
  try {
    // Generate a session token
    const sessionToken = randomBytes(43).toString('hex')

    // Retrieve connection information
    const { ip, userAgent } = connection

    // Database insert for session
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    })

    // Return session token
    return sessionToken
  } catch (e) {
    throw new Error('Session creation failed')
  }
}

export { createSession }
