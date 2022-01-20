import bcrypt from 'bcryptjs'
import { user } from './../user/user.js'

const { genSalt, hash } = bcrypt

async function registerUser(email, password) {
  // Generate salt
  const salt = await genSalt(10)

  // Hash with salt
  const hashedPassword = await hash(password, salt)

  // Store in database
  const result = await user.insertOne({
    email: { address: email, verified: false },
    password: hashedPassword,
  })

  // Return user from database
  return result.insertedId
}

export { registerUser }
