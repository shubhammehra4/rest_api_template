const db = require("../models");

exports.pictureUpload = async (req, res, next) => {
    try {
        console.log(req.files);
        return res.status(200).json({ message: "done" });
    } catch (err) {
        next({
            status: 400,
            message: "Failed to Upload!",
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { password, newpassword } = req.body;
        const user = await db.User.findById(req.params.id);
        let isMatch = await user.comparePassword(password);
        if (isMatch) {
            user.password = newpassword;
            await user.save();
            return res.status(200).json({ message: "done" });
        } else {
            return next({
                status: 400,
                message: "Old Password is invalid",
            });
        }
    } catch (err) {
        return next(err);
    }
};
