const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

/**
 * Public Admin Routes
 */

// Admin login (no auth required)
router.post('/login', adminController.login);

/**
 * Protected Admin Routes (require authentication)
 */

// Get all quizzes
router.get('/quizzes', authMiddleware, adminController.getAllQuizzes);

// Get single quiz by ID
router.get('/quiz/:id', authMiddleware, adminController.getQuizById);

// Create new quiz
router.post('/quiz', authMiddleware, adminController.createQuiz);

// Update quiz
router.put('/quiz/:id', authMiddleware, adminController.updateQuiz);

// Delete quiz
router.delete('/quiz/:id', authMiddleware, adminController.deleteQuiz);

// Toggle quiz active status
router.patch('/quiz/:id/toggle', authMiddleware, adminController.toggleQuizStatus);

module.exports = router;
