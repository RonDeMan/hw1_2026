import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_CONNECTION_URL!).then(async () => {
  await mongoose.connection.db.collection('notes').deleteMany({});
  await mongoose.connection.db.collection('users').deleteMany({});
  console.log('Database cleared');
  process.exit(0);
});