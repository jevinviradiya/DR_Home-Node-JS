const { signInUser, signUpUser } = require("../controllers/auth");
const {registerUser} = require("../controllers/registration")
const router = require("express").Router();
const express = require('express');
const auth = require('../middlewares/auth')

router.post("/signup", signUpUser);
router.post("/signin", signInUser);


module.exports = router;