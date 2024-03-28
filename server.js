import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'
import emailRoute from './routes/emailRoute.js'
import cors from 'cors'
import { PayPalAccount } from 'braintree';
import bodyParser from 'body-parser';
//configure env
dotenv.config()

//database config
connectDB();

//rest object

const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.json())
// app.use(express.static(path.join(__dirname, './client/build')))
const corsOptions = {
    origin: "https://ecomstore-mern.onrender.com/", // frontend URI (ReactJS)
}

//routes
app.use('/api/v1/auth',authRoutes );
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/email',emailRoute)

//rest api
app.get('/', (req,res)=>{
    res.send(
        '<h1>Welcome to an ecommerce app</h1>'
    )
} )

const PORT = process.env.PORT ||8080;

//RUN LISTEN    
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
});