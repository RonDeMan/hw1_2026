import dotenv from 'dotenv'
import mongoose from 'mongoose'

export const connectToDatabase = async () => {
  dotenv.config()

  if (!process.env.MONGODB_CONNECTION_URL) {
    console.error('MONGODB_CONNECTION_URL environment variable is not set')
    process.exit(1)
  }

  const url = process.env.MONGODB_CONNECTION_URL
  mongoose.set('strictQuery', false)
  await mongoose.connect(url, { family: 4 })
}