import app from './expressApp.ts'
import { connectToDatabase } from './config/mongo.ts'
import { PORT } from './consts.ts'

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()