import { createSession } from './session.js'
import { refreshTokens } from './user.js'

async function logUserIn(userId, request, reply) {
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }

  // Create session
  const sessionToken = await createSession(userId, connectionInformation)

  // Create JWT
  // Set cookie
  await refreshTokens(sessionToken, userId, reply)
}

export { logUserIn }
