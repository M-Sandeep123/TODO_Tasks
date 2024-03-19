const subtaskController = require('../controllers/subtask.controller');
const authJwtMiddleware = require('../middlewares/authJwt.middleWare');

// Routes for Subtasks
module.exports = (app) => {
    app.post('/api/subtasks', [authJwtMiddleware.verifyToken], subtaskController.createSubtask);
    app.get('/api/subtasks', [authJwtMiddleware.verifyToken], subtaskController.getUserSubtasks);
    app.put('/api/subtasks/:id', [authJwtMiddleware.verifyToken], subtaskController.updateSubtask);
    app.delete('/api/subtasks/:id', [authJwtMiddleware.verifyToken], subtaskController.deleteSubtask);
}

