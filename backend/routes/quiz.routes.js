const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

/**
 * Public Routes - No authentication required
 */

// Get quiz by quiz ID (used by calculator pages)
router.get('/:quizId', quizController.getQuizByQuizId);

// Get all active quizzes (for listing)
router.get('/', quizController.getAllActiveQuizzes);

module.exports = router;
