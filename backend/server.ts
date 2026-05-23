import app from './expressApp'
import { connectToDatabase } from './config/mongo'
import { PORT } from './consts'

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()