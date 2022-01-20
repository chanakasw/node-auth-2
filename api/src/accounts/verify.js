import crypto from 'crypto'
import { user } from './../user/user.js'

const { ROOT_DOMAIN, UI_SERVER_PORT, JWT_SIGNATURE } = process.env

async function createVerifyEmailToken(email) {
  try {
    // Auth string, JWT signature, email
    const authString = `${JWT_SIGNATURE}:${email}`
    return crypto.createHash('sha256').update(authString).digest('hex')
  } catch (e) {
    console.error(e)
  }
}

async function createVerifyEmailLink(email) {
  try {
    // Create token
    const emailToken = await createVerifyEmailToken(email)
    // Encode URL string
    const URIEncodedEmail = encodeURIComponent(email)
    // Return link for verification
    return `http://${ROOT_DOMAIN}:${UI_SERVER_PORT}/verify/${URIEncodedEmail}/${emailToken}`
  } catch (e) {
    console.error(e)
  }
}

async function validateVerifyEmail(token, email) {
  try {
    // Create a hash AKA token
    const emailToken = await createVerifyEmailToken(email)

    // Compare hash with token
    const isValid = emailToken === token

    // If successfull
    if (isValid) {
      // Update user to make them verified
      await user.updateOne(
        { 'email.address': email },
        { $set: { 'email.verified': true } }
      )
      // Return success
      return true
    }
    return false
  } catch (e) {
    console.error(e)
    return false
  }
}

export { createVerifyEmailToken, createVerifyEmailLink, validateVerifyEmail }
