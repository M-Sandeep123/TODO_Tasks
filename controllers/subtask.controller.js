const Subtask = require('../models/subtask.model');
const Task = require("../models/task.model");

// Controller function to create a new subtask
const createSubtask = async (req, res) => {
    try {
        const { title, description, due_date, parent_task } = req.body;
        const createdBy = req.user;

        // Create new subtask
        const newSubtask = await Subtask.create({
            title,
            description,
            due_date,
            parent_task,
            createdBy
        });

        res.status(201).json({ success: true, data: newSubtask });
    } catch (error) {
        console.log("Internal server error while creating the subtask : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


const updateSubtask = async (req, res) => {
    try {
        const subtaskId = req.params.id;
        const { status } = req.body;
        let subtask = await Subtask.findById(subtaskId);

        if (!subtask) {
            return res.status(404).json({ success: false, error: "Subtask not found" });
        }

        subtask.status = status;

        subtask = await subtask.save();

        const parentTaskId = subtask.parent_task;
        if (parentTaskId) {
            const parentTask = await Task.findById(parentTaskId);
            if (!parentTask) {
                console.log("Parent task not found for subtask:", parentTaskId);
            } else {
                const allSubtasks = await Subtask.find({ parent_task: parentTaskId });
                const completedSubtasks = allSubtasks.filter(sub => sub.status === 1);
                parentTask.status = completedSubtasks.length === allSubtasks.length ? 'DONE' : 'IN_PROGRESS';
                await parentTask.save();
            }
        }

        res.status(200).json({ success: true, data: subtask });
    } catch (error) {
        console.log("Internal server error while updating the subtask : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUserSubtasks = async (req, res) => {
    try {
        const createdBy = req.user;
        const { task_id } = req.query;

        let query = { createdBy };

        if (task_id) {
            query.parent_task = task_id;
        }

        const subtasks = await Subtask.find(query);

        res.status(200).json({ success: true, data: subtasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteSubtask = async (req, res) => {
    try {
        const subtaskId = req.params.id;

        // Find the subtask by ID and mark it as deleted
        const subtask = await Subtask.findByIdAndUpdate(subtaskId, { deletedAt: new Date() }, { new: true });

        if (!subtask) {
            return res.status(404).json({ success: false, error: "Subtask not found" });
        }

        res.status(200).json({ success: true, data: subtask });
    } catch (error) {
        console.error("Internal server error while deleting the subtask : ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createSubtask,updateSubtask, deleteSubtask, getUserSubtasks };

