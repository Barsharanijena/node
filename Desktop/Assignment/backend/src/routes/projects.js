// const express = require('express');
// const { body } = require('express-validator');
// const router = express.Router();

// // Test route
// router.get('/test', (req, res) => {
//   res.json({ message: 'Project routes working' });
// });

// // Get all projects
// router.get('/', (req, res) => {
//   res.json({ 
//     message: 'Get projects endpoint',
//     projects: [
//       { id: 1, title: 'Sample Project', status: 'active' },
//       { id: 2, title: 'Another Project', status: 'completed' }
//     ]
//   });
// });

// // Create project
// router.post('/', [
//   body('title').trim().notEmpty(),
//   body('description').trim().notEmpty(),
//   body('status').optional().isIn(['active', 'completed'])
// ], (req, res) => {
//   res.json({ 
//     message: 'Create project endpoint',
//     project: {
//       id: Date.now(),
//       title: req.body.title,
//       description: req.body.description,
//       status: req.body.status || 'active'
//     }
//   });
// });

// // Get single project
// router.get('/:id', (req, res) => {
//   res.json({ 
//     message: 'Get single project endpoint',
//     project: {
//       id: req.params.id,
//       title: 'Sample Project',
//       description: 'This is a sample project',
//       status: 'active'
//     }
//   });
// });

// // Update project
// router.put('/:id', [
//   body('title').trim().notEmpty(),
//   body('description').trim().notEmpty(),
//   body('status').optional().isIn(['active', 'completed'])
// ], (req, res) => {
//   res.json({ 
//     message: 'Update project endpoint',
//     project: {
//       id: req.params.id,
//       title: req.body.title,
//       description: req.body.description,
//       status: req.body.status
//     }
//   });
// });

// // Delete project
// router.delete('/:id', (req, res) => {
//   res.json({ 
//     message: 'Delete project endpoint',
//     deletedId: req.params.id
//   });
// });

// module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProject
} = require('../controllers/projectController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Project routes working' });
});

// Get all projects - NOW USING REAL DATABASE
router.get('/', authMiddleware, getProjects);

// Create project - NOW USING REAL DATABASE
router.post('/', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['active', 'completed']).withMessage('Status must be active or completed')
], createProject);

// Get single project - NOW USING REAL DATABASE
router.get('/:id', authMiddleware, getProject);

// Update project - NOW USING REAL DATABASE
router.put('/:id', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['active', 'completed']).withMessage('Status must be active or completed')
], updateProject);

// Delete project - NOW USING REAL DATABASE
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;