const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
   name: { type: String, required: true, unique: false },
  username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    phoneNumber: { type: String, required: true, unique: false},
    password: { type: String, required: true},
     isVerified: { type: Boolean, default: false },
    wallet_balance: { type: Number, default: 1000},
    resetPasswordToten: {type: String},
    resetPasswordExpires: { type: Date },
    transactionPin: { type: String },

    
    // starting vitual fund
    
    role: { type: String, enum: ['user', 'admin'], default: 'user'}
})



const User = new mongoose.model("User", userSchema)
  
  module.exports = User