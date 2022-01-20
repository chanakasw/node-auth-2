import crypto from 'crypto'
import { user } from './../user/user.js'

const { ROOT_DOMAIN, UI_SERVER_PORT, JWT_SIGNATURE } = process.env

function createResetToken(email, expTimestamp) {
  try {
    // Auth string, JWT signature, email
    const authString = `${JWT_SIGNATURE}:${email}:${expTimestamp}`
    return crypto.createHash('sha256').update(authString).digest('hex')
  } catch (e) {
    console.error(e)
  }
}

function validateExpTimestamp(expTimestamp) {
  // One day in milliseconds
  const expTime = 24 * 60 * 60 * 1000
  // Difference between now and expired time
  const dateDiff = Number(expTimestamp) - Date.now()
  // We're expired if not in past OR difference in time is less than allowed
  const isValid = dateDiff > 0 && dateDiff < expTime
  return isValid
}

async function createResetEmailLink(email) {
  try {
    // Encode URL string
    const URIEncodedEmail = encodeURIComponent(email)
    // Create timestamp
    const expTimestamp = Date.now() + 24 * 60 * 60 * 1000
    // Create token
    const token = createResetToken(email, expTimestamp)

    // Link email contains user email, token, expiration date
    return `http://${ROOT_DOMAIN}:${UI_SERVER_PORT}/reset/${URIEncodedEmail}/${expTimestamp}/${token}`
  } catch (e) {
    console.error(e)
  }
}

async function createResetLink(email) {
  try {
    // Check to see if a user exists with that email
    const foundUser = await user.findOne({ 'email.address': email })
    console.log('email', email)
    console.log('foundUser', foundUser)

    // If user exists
    if (foundUser) {
      // Create email link
      const link = await createResetEmailLink(email)
      return link
    }
    return ''
  } catch (e) {
    console.error(e)
    return false
  }
}

async function validateResetEmail(token, email, expTimestamp) {
  try {
    // Create a hash aka token
    const resetToken = createResetToken(email, expTimestamp)

    // Compare hash with token
    const isValid = resetToken === token

    // Time is not expired
    const isTimestampValid = validateExpTimestamp(expTimestamp)
    console.log('isTimestampValid', isTimestampValid)
    return isValid && isTimestampValid
  } catch (e) {
    console.error(e)
    return false
  }
}

export { createResetLink, createResetEmailLink, validateResetEmail }
