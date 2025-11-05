const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Admin Login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Get admin user from database
    const [rows] = await db.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const admin = rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    await db.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      username: admin.username
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

/**
 * Get all quizzes (admin view)
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM quiz_sets ORDER BY created_at DESC`
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

/**
 * Get single quiz by ID
 */
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM quiz_sets WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    res.json({
      success: true,
      quiz: rows[0]
    });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching quiz' 
    });
  }
};

/**
 * Create new quiz
 */
exports.createQuiz = async (req, res) => {
  try {
    const {
      quiz_name,
      question_1_text, question_1_placeholder, question_1_answer,
      question_2_text, question_2_placeholder, question_2_answer,
      question_3_text, question_3_placeholder, question_3_answer,
      result_message, reward_link,
      timer_duration, require_answer
    } = req.body;

    // Validate required fields
    if (!quiz_name || !question_1_text || !question_2_text || !question_3_text || !result_message || !reward_link) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Generate unique quiz IDs
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const quiz_1_id = `q1_emi_${timestamp}_${random}`;
    const quiz_2_id = `q2_sip_${timestamp}_${random}`;
    const quiz_3_id = `q3_swp_${timestamp}_${random}`;
    const result_id = `res_${timestamp}_${random}`;

    // Insert into database
    const [result] = await db.query(
      `INSERT INTO quiz_sets (
        quiz_name,
        quiz_1_id, quiz_2_id, quiz_3_id, result_id,
        question_1_text, question_1_placeholder, question_1_answer,
        question_2_text, question_2_placeholder, question_2_answer,
        question_3_text, question_3_placeholder, question_3_answer,
        result_message, reward_link,
        timer_duration, require_answer, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        quiz_name,
        quiz_1_id, quiz_2_id, quiz_3_id, result_id,
        question_1_text, question_1_placeholder || 'Type your answer here...', question_1_answer,
        question_2_text, question_2_placeholder || 'Type your answer here...', question_2_answer,
        question_3_text, question_3_placeholder || 'Type your answer here...', question_3_answer,
        result_message, reward_link,
        timer_duration || 30, require_answer ? 1 : 0
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quizId: result.insertId,
      quiz_1_id,
      entryLink: `/emi-calculator.html?quizid=${quiz_1_id}`
    });

  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating quiz' 
    });
  }
};

/**
 * Update quiz
 */
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      quiz_name,
      question_1_text, question_1_placeholder, question_1_answer,
      question_2_text, question_2_placeholder, question_2_answer,
      question_3_text, question_3_placeholder, question_3_answer,
      result_message, reward_link,
      timer_duration, require_answer, is_active
    } = req.body;

    // Check if quiz exists
    const [existing] = await db.query('SELECT id FROM quiz_sets WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    // Update quiz
    await db.query(
      `UPDATE quiz_sets SET
        quiz_name = ?,
        question_1_text = ?, question_1_placeholder = ?, question_1_answer = ?,
        question_2_text = ?, question_2_placeholder = ?, question_2_answer = ?,
        question_3_text = ?, question_3_placeholder = ?, question_3_answer = ?,
        result_message = ?, reward_link = ?,
        timer_duration = ?, require_answer = ?, is_active = ?
      WHERE id = ?`,
      [
        quiz_name,
        question_1_text, question_1_placeholder, question_1_answer,
        question_2_text, question_2_placeholder, question_2_answer,
        question_3_text, question_3_placeholder, question_3_answer,
        result_message, reward_link,
        timer_duration, require_answer ? 1 : 0, is_active ? 1 : 0,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Quiz updated successfully'
    });

  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating quiz' 
    });
  }
};

/**
 * Delete quiz
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM quiz_sets WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quiz not found' 
      });
    }

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting quiz' 
    });
  }
};

/**
 * Toggle quiz active status
 */
exports.toggleQuizStatus = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE quiz_sets SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Quiz status toggled successfully'
    });

  } catch (error) {
    console.error('Error toggling quiz status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while toggling quiz status' 
    });
  }
};
