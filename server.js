const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const serverConfig = require("./Configs/server.config");
const dbConfig = require("./Configs/db.config");
const User = require("./models/user.model");
const cornJobsScheduler = require("./middlewares/cornJobs.middleWare");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
cornJobsScheduler.start();

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on("error", () => {
    console.log("DataBase is not connected");
});

db.once("open", () => {
    console.log("DataBase is connected successfully");
    //init();
});

async function init() {
    await User.collection.drop();
    const admin = await User.create({
        firstName: "Mudigonda",
        lastName: "sandeep",
        email: "mudigondasandeep01@gmail.com",
        password: bcrypt.hashSync("123456", 8),
        role: "ADMIN",
        contactNumber: 8688692077,
        userName: "mudigondasandeep01@gmail.com"
    });
    console.log(admin);
}

require("./routes/auth.route")(app);
require("./routes/task.route")(app);
require("./routes/subtask.route")(app);

app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
});