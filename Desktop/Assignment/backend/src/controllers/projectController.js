const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res) => {
  try {
    console.log('🔥 GETTING PROJECTS FOR USER:', req.user.email);
    
    // Get REAL projects from database
    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log('📊 FOUND PROJECTS FROM DATABASE:', projects.length);
    console.log('📊 PROJECTS DATA:', projects);
    
    // Return projects directly (not wrapped in message object)
    res.json(projects);
  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;
    
    console.log('🔥 CREATING PROJECT:', { title, description, status });
    console.log('🔥 FOR USER:', req.user.email);

    const project = new Project({
      title,
      description,
      status: status || 'active',
      userId: req.user._id
    });

    const savedProject = await project.save();
    console.log('✅ PROJECT SAVED:', savedProject);
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated tasks
    await Task.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProject
};