
const express = require("express");
const { register, verifyEmail, login, getUsers, logout, forgotPassword, resetPassword, changePassword } = require("../controllers/authController");
const auth = require("../middleware/auth"); 
const admin = require("../middleware/admin"); 
const router = express.Router();

const authMiddleware = require("../middleware/auth");







router.post("/register", register)
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login)
router.get("/users", auth, admin, getUsers)

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logout);



module.exports = router;