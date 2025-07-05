const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Task routes working' });
});

// Get tasks for a project
router.get('/project/:projectId', (req, res) => {
  const { status } = req.query;
  
  let tasks = [
    { id: 1, title: 'Task 1', status: 'todo', projectId: req.params.projectId },
    { id: 2, title: 'Task 2', status: 'in-progress', projectId: req.params.projectId },
    { id: 3, title: 'Task 3', status: 'done', projectId: req.params.projectId }
  ];

  if (status) {
    tasks = tasks.filter(task => task.status === status);
  }

  res.json({ 
    message: 'Get tasks endpoint',
    projectId: req.params.projectId,
    filter: status || 'all',
    tasks: tasks
  });
});

// Create task
router.post('/project/:projectId', [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('dueDate').isISO8601()
], (req, res) => {
  res.json({ 
    message: 'Create task endpoint',
    task: {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'todo',
      dueDate: req.body.dueDate,
      projectId: req.params.projectId
    }
  });
});

// Update task
router.put('/:taskId', [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('dueDate').isISO8601()
], (req, res) => {
  res.json({ 
    message: 'Update task endpoint',
    task: {
      id: req.params.taskId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate
    }
  });
});

// Delete task
router.delete('/:taskId', (req, res) => {
  res.json({ 
    message: 'Delete task endpoint',
    deletedId: req.params.taskId
  });
});

module.exports = router;