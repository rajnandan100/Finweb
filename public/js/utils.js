/**
 * Utility Functions for Financial Calculator
 */

// ============================================================
// 1. URL Parameter Helper
// ============================================================
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ============================================================
// 2. Number Formatting
// ============================================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

function formatPercentage(num, decimals = 2) {
  return num.toFixed(decimals) + '%';
}

// ============================================================
// 3. Calculator Functions
// ============================================================

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {object} EMI details
 */
function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  
  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(principal),
      totalInterest: 0,
      principal: Math.round(principal)
    };
  }
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;
  
  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    principal: Math.round(principal)
  };
}

/**
 * Calculate SIP (Systematic Investment Plan)
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} annualReturn - Expected annual return rate (percentage)
 * @param {number} tenureYears - Investment tenure in years
 * @returns {object} SIP details
 */
function calculateSIP(monthlyInvestment, annualReturn, tenureYears) {
  const monthlyRate = annualReturn / 12 / 100;
  const tenureMonths = tenureYears * 12;
  
  if (monthlyRate === 0) {
    const totalInvestment = monthlyInvestment * tenureMonths;
    return {
      futureValue: Math.round(totalInvestment),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: 0
    };
  }
  
  const futureValue = monthlyInvestment * 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1) / 
                     monthlyRate * (1 + monthlyRate);
  
  const totalInvestment = monthlyInvestment * tenureMonths;
  const totalReturns = futureValue - totalInvestment;
  
  return {
    futureValue: Math.round(futureValue),
    totalInvestment: Math.round(totalInvestment),
    totalReturns: Math.round(totalReturns)
  };
}

/**
 * Calculate SWP (Systematic Withdrawal Plan)
 * @param {number} initialInvestment - Initial investment amount
 * @param {number} monthlyWithdrawal - Monthly withdrawal amount
 * @param {number} annualReturn - Expected annual return rate (percentage)
 * @param {number} tenureYears - Withdrawal tenure in years
 * @returns {object} SWP details
 */
function calculateSWP(initialInvestment, monthlyWithdrawal, annualReturn, tenureYears) {
  const monthlyRate = annualReturn / 12 / 100;
  const tenureMonths = tenureYears * 12;
  
  let balance = initialInvestment;
  let totalWithdrawn = 0;
  
  for (let month = 1; month <= tenureMonths; month++) {
    // Add returns
    balance = balance * (1 + monthlyRate);
    
    // Withdraw
    if (balance >= monthlyWithdrawal) {
      balance -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
    } else {
      totalWithdrawn += balance;
      balance = 0;
      break;
    }
  }
  
  const totalReturns = (totalWithdrawn + balance) - initialInvestment;
  
  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    remainingBalance: Math.round(balance),
    totalReturns: Math.round(totalReturns),
    initialInvestment: Math.round(initialInvestment)
  };
}

// ============================================================
// 4. Quiz Timer Class
// ============================================================
class QuizTimer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.timeLeft = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => {
      this.timeLeft--;
      
      if (this.onTick) {
        this.onTick(this.timeLeft);
      }
      
      if (this.timeLeft <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getTimeColor() {
    if (this.timeLeft > 15) return 'timer-green';
    if (this.timeLeft > 5) return 'timer-yellow';
    return 'timer-red';
  }

  getFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// ============================================================
// 5. API Helper Functions
// ============================================================
const API_BASE_URL = window.location.origin + '/api';

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function getAuthToken() {
  return localStorage.getItem('admin_token');
}

function setAuthToken(token) {
  localStorage.setItem('admin_token', token);
}

function removeAuthToken() {
  localStorage.removeItem('admin_token');
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ============================================================
// 6. Quiz API Functions
// ============================================================
async function fetchQuiz(quizId) {
  return await apiRequest(`/quiz/${quizId}`);
}

async function fetchActiveQuizzes() {
  return await apiRequest('/quiz');
}

// ============================================================
// 7. Admin API Functions
// ============================================================
async function adminLogin(username, password) {
  return await apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function fetchAllQuizzes() {
  return await apiRequest('/admin/quizzes', {
    headers: getAuthHeaders()
  });
}

async function fetchQuizById(id) {
  return await apiRequest(`/admin/quiz/${id}`, {
    headers: getAuthHeaders()
  });
}

async function createQuiz(quizData) {
  return await apiRequest('/admin/quiz', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(quizData)
  });
}

async function updateQuiz(id, quizData) {
  return await apiRequest(`/admin/quiz/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(quizData)
  });
}

async function deleteQuiz(id) {
  return await apiRequest(`/admin/quiz/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

async function toggleQuizStatus(id) {
  return await apiRequest(`/admin/quiz/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
}

// ============================================================
// 8. UI Helper Functions
// ============================================================
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

function showLoading(element) {
  const originalContent = element.innerHTML;
  element.innerHTML = '<span class="loading"></span> Loading...';
  element.disabled = true;
  
  return () => {
    element.innerHTML = originalContent;
    element.disabled = false;
  };
}

// ============================================================
// 9. Validation Functions
// ============================================================
function validatePositiveNumber(value, fieldName) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return num;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// 10. Export for use in other scripts
// ============================================================
window.FinancialCalc = {
  // URL helpers
  getQueryParam,
  
  // Formatting
  formatCurrency,
  formatNumber,
  formatPercentage,
  
  // Calculators
  calculateEMI,
  calculateSIP,
  calculateSWP,
  
  // Quiz timer
  QuizTimer,
  
  // API
  fetchQuiz,
  fetchActiveQuizzes,
  adminLogin,
  fetchAllQuizzes,
  fetchQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  toggleQuizStatus,
  
  // Auth
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  
  // UI
  showAlert,
  showLoading,
  
  // Validation
  validatePositiveNumber,
  validateEmail,
  validateURL
};
