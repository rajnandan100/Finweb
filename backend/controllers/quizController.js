const db = require('../config/database');

/**
 * Get quiz by quiz ID (for any of the 3 pages or results)
 * Determines which question to return based on quiz ID format
 */
exports.getQuizByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quiz ID is required' 
      });
    }

    // Search for quiz in all quiz ID columns
    const [rows] = await db.query(
      `SELECT * FROM quiz_sets 
       WHERE (quiz_1_id = ? OR quiz_2_id = ? OR quiz_3_id = ? OR result_id = ?)
       AND is_active = 1
       LIMIT 1`,
      [quizId, quizId, quizId, quizId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found or inactive' 
      });
    }

    const quiz = rows[0];
    let response = {
      success: true,
      quizName: quiz.quiz_name,
      timerDuration: quiz.timer_duration,
      requireAnswer: quiz.require_answer === 1
    };

    // Determine which question to return based on quiz ID
    if (quizId === quiz.quiz_1_id) {
      // EMI Calculator Page - Question 1
      response.questionText = quiz.question_1_text;
      response.placeholder = quiz.question_1_placeholder;
      response.nextQuizId = quiz.quiz_2_id;
      response.nextPageUrl = '/sip-calculator.html';
      response.pageType = 'emi';
    } else if (quizId === quiz.quiz_2_id) {
      // SIP Calculator Page - Question 2
      response.questionText = quiz.question_2_text;
      response.placeholder = quiz.question_2_placeholder;
      response.nextQuizId = quiz.quiz_3_id;
      response.nextPageUrl = '/swp-calculator.html';
      response.pageType = 'sip';
    } else if (quizId === quiz.quiz_3_id) {
      // SWP Calculator Page - Question 3
      response.questionText = quiz.question_3_text;
      response.placeholder = quiz.question_3_placeholder;
      response.nextQuizId = quiz.result_id;
      response.nextPageUrl = '/quiz-results.html';
      response.pageType = 'swp';
    } else if (quizId === quiz.result_id) {
      // Results Page
      response.resultMessage = quiz.result_message;
      response.rewardLink = quiz.reward_link;
      response.pageType = 'results';
    }

    res.json(response);

  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching quiz' 
    });
  }
};

/**
 * Get all active quizzes (for admin or listing)
 */
exports.getAllActiveQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, quiz_name, quiz_1_id, quiz_2_id, quiz_3_id, result_id, 
              is_active, created_at 
       FROM quiz_sets 
       WHERE is_active = 1
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      quizzes: rows
    });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching quizzes' 
    });
  }
};
