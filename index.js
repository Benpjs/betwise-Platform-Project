const express = require ("express")
const mongoose = require ("mongoose")
const dotenv = require ("dotenv")
const bcrypt = require ("bcryptjs")
const jwt = require ("jsonwebtoken")

const cors = require("cors");
 //const Game = require ("")
// const User = require ("")
 const auth = require('./middlewares/auth');
 const admin = require('./middlewares/admin');

 

// const router = express.Router()
const authRoutes = require('./routes/authRoute')
const adminRoutes = require('./routes/adminRoute');
const betRoutes = require('./routes/betRoute');
const gameRoutes = require('./routes/gameRoute');
const walletRoutes = require('./routes/walletRoute')




dotenv.config()



const app = express ()
app.use (express.json ())
const PORT =process.env.PORT || 6000

mongoose.connect(process.env.MONGODB_URL)

.then(()=>{
    console.log("mongodb connected...")

    app.listen(PORT, () =>{
        console.log(`server started running on ${PORT}`)
       
    })


})

//routes
app.use("/api/auth", authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/wallet', walletRoutes);


