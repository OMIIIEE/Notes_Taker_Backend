const express = require("express");
const { signup, login, getUser } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user",auth, getUser);

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    return res.json({ Status: true });
  });

module.exports = router;
