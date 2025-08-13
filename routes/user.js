const express = require("express");
const router =  express.Router({});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const  userContrrollers = require("../controllers/users.js");




router.route("/signup")
.get(userContrrollers.renderSignUpForm)
.post(wrapAsync(userContrrollers.signup))



router.route("/login")
.get(userContrrollers.renderLoginForm)
.post(
    saveRedirectUrl ,
    passport.authenticate("local",
         { failureRedirect: '/login',
            failureFlash:true }),
           userContrrollers.login)

router.get("/logout",userContrrollers.logout)

module.exports = router;