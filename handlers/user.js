const db = require("../models");
import { cloudinary } from "../middlewares/cloudinary";

exports.pictureUpload = async (req, res, next) => {
    try {
        // const { id } = req.params;
        // const { path, filename } = req.files;
        console.log(req.files);
        // const user = await db.User.findById(id);
        // if (user.picture) {
        //! Delete the previous image and update db with the new one
        // let { filename } = user.picture;
        // await cloudinary.uploader.destroy(filename);
        // }
        // user.picture = { url: path, filename };
        // await user.save();

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
