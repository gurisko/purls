import mongoose from 'mongoose';

export async function connect(): Promise<void> {
  const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/purls';
  mongoose.set('useCreateIndex', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);
  await mongoose.connect(url);
  console.log('Connected to MongoDB');
}
