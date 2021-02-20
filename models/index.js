const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
}
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URL, {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("DB Connected");
});

module.exports.User = require("./user");
