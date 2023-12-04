const express=require('express')
const { connection } = require('./config/db')
const { userRoute } = require('./routes/user.route')
const { productRoute } = require('./routes/product.route')
const { auth } = require('./middleware/authenticate')
const app=express()
require('dotenv').config()
app.use(express.json())

app.use('/api',userRoute)
app.use(auth)
app.use('/api',productRoute)

app.listen(process.env.Port, async()=>{
    try {
        await connection
        console.log('Connected to Database');
    } catch (err) {
        console.log(err.message);
    } console.log(`Server is running on Port ${process.env.PORT}`);
})