const express = require("express"),
    router = express.Router();

const multer = require("multer"),
    { storage } = require("../middlewares/cloudinary"),
    upload = multer({ storage });

const { pictureUpload } = require("../handlers/user");

router.get("/:id/profile/upload", upload.single("image"), pictureUpload);
