
const jwt = require("jsonwebtoken");
const config = require("../Configs/auth.config");

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({
            message: "Please login first to access this endpoint!"
        });
    }
    jwt.verify(token, config.secert, (err, decoded) => {
        if (err) {
            return res.status(400).send({
                message: "Invaid token"
            });
        }
        req.user = decoded.user_id; 
        next();

    });
}

module.exports = {
    verifyToken: verifyToken
}