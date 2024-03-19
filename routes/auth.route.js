
const authController = require("../controllers/auth.controller");
const authMiddleWare = require("../middlewares/auth.middleWare");

module.exports = (app) => {

    app.post("/api/users", [authMiddleWare.validEmail, authMiddleWare.validNumber], authController.signUp);

    app.post("/api/signin", [authMiddleWare.validEmail], authController.signIn);
}