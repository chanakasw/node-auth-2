import jwt from 'jsonwebtoken'
import { session } from './../session/session.js'

const { JWT_SIGNATURE, ROOT_DOMAIN } = process.env

async function logUserOut(request, reply) {
  try {
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies

      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE)

      // Delete database record for session
      await session.deleteOne({ sessionToken })
    }
    // Remove cookie
    const cookieOptions = {
      path: '/',
      domain: ROOT_DOMAIN,
      httpOnly: true,
      secure: true,
    }
    reply
      .clearCookie('refreshToken', cookieOptions)
      .clearCookie('accessToken', cookieOptions)
  } catch (e) {
    console.error(e)
  }
}

export { logUserOut }
