import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeforge';
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Warning: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      // Exit in production — DB is required
      console.error('💥 Production requires a working MongoDB connection. Exiting.');
      process.exit(1);
    } else {
      // In development, warn but keep server alive
      console.warn('🔧 Running without MongoDB. Set MONGODB_URI in .env to connect.');
      console.warn('   API endpoints requiring DB will return 500 errors until connected.');
    }
  }
};

export default connectDB;
