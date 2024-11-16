import mongoose from 'mongoose';
import { config } from 'dotenv';
config()

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI,);
		console.log('MongoDB connected');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};
