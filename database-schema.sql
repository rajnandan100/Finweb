-- ============================================================
-- Financial Calculator Database Schema
-- Database: financial_calculator
-- Description: Quiz system for EMI, SIP, SWP calculators
-- ============================================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS financial_calculator
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE financial_calculator;

-- ============================================================
-- Table: quiz_sets
-- Description: Stores quiz questions for each calculator page
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_sets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_name VARCHAR(255) NOT NULL COMMENT 'Display name for the quiz set',
  
  -- Quiz IDs for each page (unique identifiers)
  quiz_1_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'EMI Calculator page quiz ID',
  quiz_2_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'SIP Calculator page quiz ID',
  quiz_3_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'SWP Calculator page quiz ID',
  result_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Results page ID',
  
  -- Question 1 (EMI Calculator Page)
  question_1_text TEXT NOT NULL COMMENT 'Question displayed on EMI page',
  question_1_placeholder VARCHAR(255) DEFAULT 'Type your answer here...' COMMENT 'Input placeholder',
  question_1_answer TEXT NULL COMMENT 'Reference answer (optional, not validated)',
  
  -- Question 2 (SIP Calculator Page)
  question_2_text TEXT NOT NULL COMMENT 'Question displayed on SIP page',
  question_2_placeholder VARCHAR(255) DEFAULT 'Type your answer here...' COMMENT 'Input placeholder',
  question_2_answer TEXT NULL COMMENT 'Reference answer (optional, not validated)',
  
  -- Question 3 (SWP Calculator Page)
  question_3_text TEXT NOT NULL COMMENT 'Question displayed on SWP page',
  question_3_placeholder VARCHAR(255) DEFAULT 'Type your answer here...' COMMENT 'Input placeholder',
  question_3_answer TEXT NULL COMMENT 'Reference answer (optional, not validated)',
  
  -- Results page configuration
  result_message TEXT NOT NULL COMMENT 'Congratulations message on results page',
  reward_link VARCHAR(500) NOT NULL COMMENT 'URL for Get Reward button',
  
  -- Quiz settings
  timer_duration INT DEFAULT 30 COMMENT 'Timer duration in seconds per question',
  require_answer TINYINT(1) DEFAULT 0 COMMENT 'Whether answer is required to proceed',
  is_active TINYINT(1) DEFAULT 1 COMMENT 'Whether quiz is currently active',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_quiz_ids (quiz_1_id, quiz_2_id, quiz_3_id, result_id),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Quiz questions for financial calculators';

-- ============================================================
-- Table: admin_users
-- Description: Admin authentication
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL,
  
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin user accounts';

-- ============================================================
-- Sample Data: Insert default quiz set
-- ============================================================
INSERT INTO quiz_sets (
  quiz_name,
  quiz_1_id, quiz_2_id, quiz_3_id, result_id,
  question_1_text, question_1_placeholder, question_1_answer,
  question_2_text, question_2_placeholder, question_2_answer,
  question_3_text, question_3_placeholder, question_3_answer,
  result_message, reward_link,
  timer_duration, require_answer, is_active
) VALUES (
  'Financial Literacy Quiz',
  'q1_emi_abc123',
  'q2_sip_def456',
  'q3_swp_ghi789',
  'res_result_jkl012',
  'What does EMI stand for in finance?',
  'Type the full form...',
  'Equated Monthly Installment',
  'How frequently are SIP investments typically made?',
  'Enter the frequency...',
  'Monthly',
  'What does SWP stand for?',
  'Type the full form...',
  'Systematic Withdrawal Plan',
  '<h2>🎉 Congratulations!</h2><p>You have successfully completed all three financial quizzes. Click below to claim your reward!</p>',
  'https://example.com/claim-reward',
  30,
  1,
  1
);

-- ============================================================
-- Views for easy querying
-- ============================================================

-- View: Active quizzes only
CREATE OR REPLACE VIEW active_quizzes AS
SELECT * FROM quiz_sets WHERE is_active = 1;

-- ============================================================
-- Show table structure
-- ============================================================
DESCRIBE quiz_sets;
DESCRIBE admin_users;

-- ============================================================
-- Show sample data
-- ============================================================
SELECT 
  id, quiz_name, quiz_1_id, quiz_2_id, quiz_3_id, result_id, is_active
FROM quiz_sets;
