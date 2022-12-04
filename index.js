const express = require('express')
const mongoos = require('mongoose')
const dotenv = require('dotenv');
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const stripeRoutes=require('./routes/stripe')
const cors=require('cors')



dotenv.config()
const app = express();
app.use(express.json())


mongoos.connect(
        process.env.MONGO_URL
    ).then(() => console.log("connection successful"))
    .catch((err) => {
        console.log(err);
    });


app.use(cors())
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/checkout',stripeRoutes)




app.listen(process.env.PORT || 5000, () => {
    console.log("backend server is runnnig");
})