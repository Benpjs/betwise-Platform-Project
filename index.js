const express = require ("express")
const mongoose = require ("mongoose")
const dotenv = require ("dotenv")
const bcrypt = require ("bcryptjs")
const jwt = require ("jsonwebtoken")
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const betRoutes = require("./routes/betRoutes");
const payoutRoutes = require("./routes/payoutRoute");
const walletRoutes = require("./routes/walletRoutes");

const cors = require("cors")

dotenv.config()

const app = express ()
app.use (express.json ())

app.use(cors())
//app.use(cors())
const PORT =process.env.PORT || 6000

mongoose.connect(process.env.MONGODB_URL)

.then(()=>{
    console.log("mongodb connected...")

    app.listen(PORT, () =>{
        console.log(`server started running on ${PORT}`)
       
    })


})

// Routes
app.use("/api/", authRoutes);
app.use("/api/", gameRoutes);
app.use("/api/", betRoutes);
app.use("/api/", payoutRoutes);
app.use("/api", walletRoutes); 




 
 
