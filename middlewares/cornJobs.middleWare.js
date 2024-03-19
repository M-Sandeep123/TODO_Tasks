const cron = require('node-cron');
const Task = require('../models/task.model');

const cornJobsSchedule = {
    start: () => {
        console.log("Cron job for changing priority of tasks based on due date started...");
        cron.schedule('0 0 * * *', async () => {
            try {
                const today = new Date();
                const tasks = await Task.find({ due_date: { $lt: today } });

                tasks.forEach(async task => {
                    let priority = 0;
                    const daysDiff = Math.floor((today - task.due_date) / (1000 * 60 * 60 * 24));

                    if (daysDiff === 0) {
                        priority = 0;
                    } else if (daysDiff <= 2) {
                        priority = 1;
                    } else if (daysDiff <= 4) {
                        priority = 2;
                    } else {
                        priority = 3;
                    }

                    await Task.findByIdAndUpdate(task._id, { priority });
                });
            } catch (error) {
                console.error('Error updating task priorities:', error);
            }
        });
    }
};

module.exports = cornJobsSchedule;
