const Task = require('../models/task.model');

// Controller function to create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, due_date, priority } = req.body;
        const createdBy = req.user;

        // Create new task
        const newTask = await Task.create({
            title,
            description,
            due_date,
            priority,
            createdBy
        });

        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.log("Internal server error while creating the task : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUserTasks = async (req, res) => {
    try {
        const createdBy = req.user;
        const { priority, due_date } = req.query;

        let query = { createdBy };

        if (priority) {
            query.priority = priority;
        }

        if (due_date) {
            // Assuming due_date filter is in ISO format
            query.due_date = { $gte: new Date(due_date) };
        }

        // Pagination logic
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tasks = await Task.find(query).skip(skip).limit(limit).sort({ due_date: 'asc' });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// Controller function to update a task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { due_date, status } = req.body;

        // Find the task by ID
        let task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // Update task properties
        if (due_date) {
            task.due_date = due_date;
        }
        if (status) {
            task.status = status;
        }

        // Save the updated task
        task = await task.save();

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.log("Internal server error while updating the task : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


// Controller function to soft delete a task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Find the task by ID and mark it as deleted
        const task = await Task.findByIdAndUpdate(taskId, { deletedAt: new Date() }, { new: true });

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error("Internal server error while deleting the task : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = { createTask,getUserTasks, updateTask, deleteTask};

