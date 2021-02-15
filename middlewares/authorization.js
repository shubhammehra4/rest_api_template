const jwt = require("jsonwebtoken");

exports.loginRequired = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(
            token,
            process.env.JWT_TOKEN_SECRET,
            function (err, decoded) {
                if (decoded) {
                    return next();
                } else {
                    return next({
                        status: 401,
                        message: "Please Login!",
                    });
                }
            }
        );
    } catch (err) {
        return next({
            status: 401,
            message: "Please Login!",
        });
    }
};

exports.ensureCorrectUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(
            token,
            process.env.JWT_TOKEN_SECRET,
            function (err, decoded) {
                if (decoded && decoded.id === req.params.id) {
                    return next();
                } else {
                    return next({
                        status: 401,
                        message: "Unauthorized Access",
                    });
                }
            }
        );
    } catch (err) {
        return next({
            status: 401,
            message: "Please Login!",
        });
    }
};
