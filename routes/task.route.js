const taskController = require('../controllers/task.controller');
const authJwtMiddle = require("../middlewares/authJwt.middleWare");

// Route for creating a new task
module.exports = (app) => {
    app.post('/api/tasks', [authJwtMiddle.verifyToken], taskController.createTask);
    app.get('/api/tasks', [authJwtMiddle.verifyToken], taskController.getUserTasks);
    app.put('/api/tasks/:id', [authJwtMiddle.verifyToken], taskController.updateTask);
    app.delete('/api/tasks/:id', [authJwtMiddle.verifyToken], taskController.deleteTask);
}

