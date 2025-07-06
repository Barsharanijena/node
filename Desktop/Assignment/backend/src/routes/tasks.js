const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Task routes working' });
});

// Get tasks for a project - NOW USING REAL DATABASE
router.get('/project/:projectId', authMiddleware, getTasks);

// Create task - NOW USING REAL DATABASE
router.post('/project/:projectId', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status must be todo, in-progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date')
], createTask);

// Update task - NOW USING REAL DATABASE
router.put('/:taskId', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status must be todo, in-progress, or done'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date')
], updateTask);

// Delete task - NOW USING REAL DATABASE
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;