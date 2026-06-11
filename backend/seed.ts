import supertest from 'supertest';
import app from './expressApp';
import { connectToDatabase } from './config/mongo';
import mongoose from 'mongoose';

async function seed() {
  await connectToDatabase();
  const api = supertest(app);
  
  const res = await api.post('/users').send({ username: 'seeder3', name: 'Seeder', password: '123', email: 'a@b.com' });
  const loginRes = await api.post('/login').send({ username: 'seeder3', password: '123' });
  const token = loginRes.body.token;

  for (let i = 0; i < 15; i++) {
    await api.post('/notes').set('Authorization', `Bearer ${token}`).send({ title: `Seeded ${i}`, content: `Pre-existing note ${i}` });
  }
  
  console.log('Seeded 15 notes successfully');
  process.exit(0);
}
seed();