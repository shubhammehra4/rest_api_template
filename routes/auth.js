const express = require("express"),
    router = express.Router(),
    rateLimiter = require("express-rate-limit"),
    MongoStore = require("rate-limit-mongo");

const { validateRegister, validateLogin } = require("../utils/validation");

const { register, login } = require("../handlers/auth.js");

// const limiter = rateLimiter({
//     store: new MongoStore({
//         uri: process.env.DB_URL,
//         collectionName: "RateLimit",
//         expireTimeMs: 3600000,
//     }),
//     windowMs: 3600000,
//     max: 10,
//     message:
//         "Too many Login/Register request from this IP, please try again after an hour",
// });
// router.use(limiter);

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

module.exports = router;
