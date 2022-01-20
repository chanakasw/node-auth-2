import jwt from 'jsonwebtoken'

const JWTSignature = process.env.JWT_SIGNATURE

async function createTokens(sessionToken, userId) {
  try {
    // Create refresh token
    // Session id
    const refreshToken = jwt.sign({ sessionToken }, JWTSignature)

    // Create access token
    // Session id, user id
    const accessToken = jwt.sign({ sessionToken, userId }, JWTSignature)

    // Return refresh token & access token
    return { refreshToken, accessToken }
  } catch (e) {
    console.error(e)
  }
}

export { createTokens }
