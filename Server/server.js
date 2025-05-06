import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://authlogin-client.onrender.com']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/' , (req, res) => {res.json("Hello API is running")});

app.use('/', authRouter);
app.use('/', userRouter)

app.listen(PORT, ()=>{
    console.log(`server is running on PORT: ${PORT}`)
})