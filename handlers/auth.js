const db = require("../models"),
    jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res, next) => {
    try {
        let user = await db.User.create({ ...req.body });
        let { id, username, email, name } = user;
        console.log(user);
        let token = jwt.sign(
            {
                id,
                username,
                email,
            },
            process.env.JWT_TOKEN_SECRET
        );
        return res.status(201).json({
            id,
            username,
            name,
            email,
            token,
        });
    } catch (err) {
        if (err.code && err.code === 11000) {
            err.keyPattern.email
                ? (err.message = "Email Already Registered!")
                : (err.message = "Username Already Taken!");
        }
        return next({
            status: 400,
            message: err.message || err,
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        let user;
        if (req.body.email) {
            user = await db.User.findOne({ email: req.body.email });
        } else {
            user = await db.User.findOne({ username: req.body.username });
        }
        let isMatch = await user.comparePassword(req.body.password);
        if (isMatch) {
            let { id, username, email, name } = user;
            let token = jwt.sign(
                {
                    id,
                    username,
                    email,
                },
                process.env.JWT_TOKEN_SECRET
            );
            return res.status(200).json({
                id,
                username,
                name,
                email,
                token,
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Credentials",
            });
        }
    } catch (err) {
        return next({
            status: 400,
            message: "Invalid Credentials",
        });
    }
};

exports.googleAuth = async (req, res, next) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        console.log(ticket, ticket.getPayload());
    } catch (err) {
        return next({
            status: 400,
            message: err.message || err,
        });
    }
};
