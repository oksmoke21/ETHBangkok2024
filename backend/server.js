import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/db.js'

import routes from './routes/routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
	origin: '*', // Allow all origins
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Body parser for JSON payloads
app.use(express.json());

// Body parser for URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);


app.listen(PORT, () => {
	// Connect database
	connectDB();
	console.log(`Server running on port ${PORT}`);
});
