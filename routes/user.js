const express = require("express"),
    router = express.Router({
        mergeParams: true,
    });

const multer = require("multer"),
    { storage } = require("../middlewares/cloudinary"),
    upload = multer({ storage });

const { pictureUpload, resetPassword } = require("../handlers/user");

router.put("/reset-password", resetPassword);

router.post("/profile/upload", upload.single("picture"), pictureUpload);

module.exports = router;
