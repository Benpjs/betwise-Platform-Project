const express = require("express");
const { createGame, getAllGames, setGameResult } = require("../controllers/gameController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.post("/creat/games", auth, admin, createGame); // Only admins
router.get("/avail/games", getAllGames);
router.post("/set-result/:id", auth, admin, setGameResult);



module.exports = router;
