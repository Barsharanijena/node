const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    console.log('🔥 GETTING TASKS FOR PROJECT:', projectId);
    console.log('🔥 FOR USER:', req.user.email);

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let query = { projectId };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    console.log('📊 FOUND TASKS FROM DATABASE:', tasks.length);
    console.log('📊 TASKS DATA:', tasks);
    
    res.json(tasks);
  } catch (error) {
    console.error('❌ Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    console.log('🔥 CREATING TASK:', { title, description, status, priority, dueDate });
    console.log('🔥 FOR PROJECT:', projectId);

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      projectId
    });

    const savedTask = await task.save();
    console.log('✅ TASK SAVED:', savedTask);
    
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('❌ Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    console.log('🔥 UPDATING TASK:', taskId);
    console.log('🔥 WITH DATA:', { title, description, status, priority, dueDate });

    // Find task and verify project belongs to user
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, priority, dueDate },
      { new: true }
    );

    console.log('✅ TASK UPDATED:', updatedTask);
    res.json(updatedTask);
  } catch (error) {
    console.error('❌ Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    console.log('🔥 DELETING TASK:', taskId);

    // Find task and verify project belongs to user
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.findByIdAndDelete(taskId);
    console.log('✅ TASK DELETED SUCCESSFULLY');
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('❌ Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};