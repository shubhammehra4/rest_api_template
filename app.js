if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"),
    cors = require("cors"),
    helmet = require("helmet"),
    mongoSanitize = require("express-mongo-sanitize"),
    errorHandler = require("./utils/Error");

const whitelist = process.env.WHITELIST_URL.split(",");
const corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

const app = express();
//! Security
app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use(mongoSanitize({ replaceWith: "_" }));
//! Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//! Dev
if (process.env.NODE_ENV !== "production") {
    const morgan = require("morgan");
    app.use(morgan("tiny"));
}

//! Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const {
    loginRequired,
    ensureCorrectUser,
} = require("./middlewares/authorization");

app.use("/api/auth", authRoutes);

app.use("/api/user/:id", ensureCorrectUser, userRoutes);

//! Errors
app.use(function (req, res, next) {
    let err = new Error("Not Found!");
    err.status = 404;
    next(err);
});
app.use(errorHandler);

//* Port
app.listen(process.env.PORT, function () {
    console.log(
        `Running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} ENV`
    );
});
