
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../Configs/auth.config");

exports.signUp = async (req, res) => {
    try {
        const userObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            contactNumber: req.body.contactNumber,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userName: req.body.email
        };

        /**
         * Check if email provided by user is already exist in dataBase/not
         */
        const Umail = await User.findOne({ email: userObj.email });
        if (Umail) {
            return res.status(403).send({
                message: "Try any other email, this email is already registered!"
            });
        }

        /**
         * Set the user role by default it is USER
         */
        if (!req.body.role || userObj.req.body.role === "USER") {
            userObj.role = "USER";
        } else {
            userObj.role = req.body.role;
        }

        /**
         * create the user and store in database
         */
        const savedUser = await User.create(userObj);

        const postResponse = {
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email
        };

        res.status(200).send(postResponse);

    } catch (err) {
        console.log("Error while creating the user : ", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
}


exports.signIn = async (req, res) => {
    try {

        /**
         * Read the data Credentials from the request body
         */
        const userName = req.body.email;
        const password = req.body.password;

        /**
         * find the user with the data in database
         */
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).send({
                message: "This email has not been registered!"
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).send({
                message: "Invalid Credentials!"
            });
        }

        /**
         * If both data is valid we generate the acces token (JWT based token)
         */
        const token = jwt.sign({
            user_id: user._id
        }, authConfig.secert, {
            expiresIn: 6000
        });
        
        res.status(200).send({
            email: user.email,
            name: user.firstName + user.lastName,
            isAuthenticated: token,
            userName: user.userName,
            role: user.role,
            contactNumber: user.contactNumber,
        });


    } catch (err) {
        console.log("Error while User login to the accout", err);
        res.status(500).json({ success: false, error: err.message });
    }
}