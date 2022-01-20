import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { user } from './../user/user.js'
import { session } from './../session/session.js'
import { createTokens } from './tokens.js'
import bcrypt from 'bcryptjs'

const { genSalt, hash } = bcrypt

const JWTSignature = process.env.JWT_SIGNATURE
const { ROOT_DOMAIN } = process.env

async function getUserFromCookies(request, reply) {
  try {
    // Check to make sure access token exists
    if (request?.cookies?.accessToken) {
      // If access token
      const { accessToken } = request.cookies

      // Decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature)

      // Return user from record
      // If we use 'await' here it will be redundant, because 'async' function implicitly returns a promise
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      })
    }

    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies

      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature)

      // Look up session
      const currentSession = await session.findOne({ sessionToken })

      // Confirm session is valid
      if (currentSession.valid) {
        // Look up current user
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        })

        // Refresh tokens
        await refreshTokens(sessionToken, currentUser._id, reply)

        // Return current user
        return currentUser
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function refreshTokens(sessionToken, userId, reply) {
  try {
    // Create JWT
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    )

    // Set cookie
    const now = new Date()
    // Get date, 30 days in the future
    const refreshExpires = now.setDate(now.getDate() + 30)
    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true,
        expires: refreshExpires,
      })
      .setCookie('accessToken', accessToken, {
        path: '/',
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true,
      })
  } catch (e) {
    console.error(e)
  }
}

async function changePassword(userId, newPassword) {
  try {
    // Generate salt
    const salt = await genSalt(10)
    // Hash with salt
    const hasedPassword = await hash(newPassword, salt)

    await user.updateOne({ _id: userId }, { $set: { password: hasedPassword } })
  } catch (e) {
    console.error(e)
  }
}
async function register2FA(userId, secret) {
  try {
    return user.updateOne({ _id: userId }, { $set: { authenticator: secret } })
  } catch (e) {
    console.error(e)
  }
}

export { getUserFromCookies, refreshTokens, changePassword, register2FA }
