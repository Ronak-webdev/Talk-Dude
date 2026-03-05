import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connect = async () => {
    try {
        console.log('Attempting connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connection Successful');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

connect();
