exports.pictureUpload = async (req, res, next) => {
    try {
        console.log(req.files);
    } catch (err) {
        next({
            status: 400,
            message: "Failed to Upload!",
        });
    }
};
