import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import postroutes from './routes/posts.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(postroutes);
app.use(express.static("uploads"))

const start  = async () =>{
    const connectDB = await mongoose.connect("mongodb+srv://kandarp0629:2Qt1GzW1oA8lTdAr@kandarp-linkedin.obl0u.mongodb.net/?retryWrites=true&w=majority&appName=kandarp-linkedin",{
        dbName : 'test'
    });
     console.log("Database Connected");
     
console.log("Connected to Database:", mongoose.connection.name);
    app.listen(9080, () =>{
        console.log("Server is running on port 9080");
    })
}

start();