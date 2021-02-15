if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"),
    cors = require("cors"),
    helmet = require("helmet"),
    mongoSanitize = require("express-mongo-sanitize"),
    errorHandler = require("./utils/Error");

const app = express();
//! Security
app.use(helmet());
app.use(cors());
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

app.user("/api/user", ensureCorrectUser, userRoutes);

//! Erros
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
