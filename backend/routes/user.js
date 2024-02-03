const express = require('express')
const router = express.Router();


const { login, signup,logout } = require("../Controller/user");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout",logout)



module.exports = router;