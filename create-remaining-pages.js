/**
 * Script to create remaining HTML pages
 * Run with: node create-remaining-pages.js
 */

const fs = require('fs');
const path = require('path');

// SWP Calculator HTML
const swpCalculatorHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Calculate SWP withdrawals for mutual funds. Free online SWP calculator to plan your systematic withdrawals.">
    <title>SWP Calculator - Calculate Systematic Withdrawal Plan</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>💳 SWP Calculator</h1>
            <p>Calculate your Systematic Withdrawal Plan</p>
            <div class="nav-links">
                <a href="/" class="nav-btn">🏠 Home</a>
                <a href="/emi-calculator.html" class="nav-btn">📈 EMI</a>
                <a href="/sip-calculator.html" class="nav-btn">📊 SIP</a>
            </div>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <div class="ad-zone ad-header"><small>Advertisement (728×90)</small></div>

            <div class="content-grid">
                <div>
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Calculate Your SWP</h2>
                            <p class="card-subtitle">Enter your withdrawal details</p>
                        </div>

                        <form id="swpForm" class="calculator-inputs">
                            <div class="form-group">
                                <label for="initialInvestment" class="form-label">Initial Investment (₹)</label>
                                <input type="number" id="initialInvestment" class="form-input" value="1000000" min="10000" step="10000" required>
                            </div>
                            <div class="form-group">
                                <label for="monthlyWithdrawal" class="form-label">Monthly Withdrawal (₹)</label>
                                <input type="number" id="monthlyWithdrawal" class="form-input" value="10000" min="1000" step="1000" required>
                            </div>
                            <div class="form-group">
                                <label for="returnRate" class="form-label">Expected Return Rate (% per annum)</label>
                                <input type="number" id="returnRate" class="form-input" value="10" min="0.1" max="30" step="0.5" required>
                            </div>
                            <div class="form-group">
                                <label for="withdrawalTenure" class="form-label">Withdrawal Tenure (Years)</label>
                                <input type="number" id="withdrawalTenure" class="form-input" value="10" min="1" max="40" step="1" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Calculate SWP</button>
                        </form>

                        <div id="swpResults" class="hidden">
                            <div class="result-box">
                                <div class="result-label">Total Withdrawn</div>
                                <div class="result-value" id="totalWithdrawn">₹0</div>
                                <div class="result-details">
                                    <div style="margin: 0.5rem 0;"><strong>Initial Investment:</strong> <span id="initialAmount">₹0</span></div>
                                    <div style="margin: 0.5rem 0;"><strong>Remaining Balance:</strong> <span id="remainingBalance">₹0</span></div>
                                    <div style="margin: 0.5rem 0;"><strong>Total Returns:</strong> <span id="totalReturns">₹0</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="quizContainer" class="hidden"></div>
                    <div class="ad-zone ad-inline"><small>Advertisement (970×250)</small></div>

                    <div class="card">
                        <h3 class="card-title" style="font-size: 1.25rem;">What is SWP?</h3>
                        <p>SWP (Systematic Withdrawal Plan) allows you to withdraw a fixed amount regularly from your mutual fund investments. It helps maintain steady income while your remaining investment continues to grow.</p>
                    </div>
                </div>
                <aside>
                    <div class="ad-zone ad-sidebar"><small>Advertisement (300×600)</small></div>
                </aside>
            </div>
        </div>
    </main>

    <script src="/js/utils.js"></script>
    <script>
        const { getQueryParam, calculateSWP, formatCurrency, fetchQuiz, QuizTimer } = window.FinancialCalc;
        const swpForm = document.getElementById('swpForm');
        const swpResults = document.getElementById('swpResults');
        const quizContainer = document.getElementById('quizContainer');

        swpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
            const monthlyWithdrawal = parseFloat(document.getElementById('monthlyWithdrawal').value);
            const returnRate = parseFloat(document.getElementById('returnRate').value);
            const withdrawalTenure = parseFloat(document.getElementById('withdrawalTenure').value);
            const result = calculateSWP(initialInvestment, monthlyWithdrawal, returnRate, withdrawalTenure);

            document.getElementById('totalWithdrawn').textContent = formatCurrency(result.totalWithdrawn);
            document.getElementById('initialAmount').textContent = formatCurrency(result.initialInvestment);
            document.getElementById('remainingBalance').textContent = formatCurrency(result.remainingBalance);
            document.getElementById('totalReturns').textContent = formatCurrency(result.totalReturns);
            swpResults.classList.remove('hidden');
        });

        ['initialInvestment', 'monthlyWithdrawal', 'returnRate', 'withdrawalTenure'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                swpForm.dispatchEvent(new Event('submit'));
            });
        });

        const quizId = getQueryParam('quizid');
        if (quizId) loadQuiz(quizId);

        async function loadQuiz(quizId) {
            try {
                const quizData = await fetchQuiz(quizId);
                if (quizData.success && quizData.pageType === 'swp') renderQuizCard(quizData);
            } catch (error) { console.error('Failed to load quiz:', error); }
        }

        function renderQuizCard(quizData) {
            const timer = new QuizTimer(quizData.timerDuration, (timeLeft) => {
                const timerElement = document.getElementById('quizTimer');
                if (timerElement) {
                    timerElement.textContent = timer.getFormattedTime();
                    timerElement.className = \`quiz-timer \${timer.getTimeColor()}\`;
                }
            }, () => { document.getElementById('quizNextBtn').disabled = false; });

            quizContainer.innerHTML = \`
                <div class="quiz-card">
                    <div class="quiz-header">
                        <div class="quiz-title"><span>📝</span><span>\${quizData.quizName}</span></div>
                        <div id="quizTimer" class="quiz-timer timer-green"><span>⏱️</span><span>\${timer.getFormattedTime()}</span></div>
                    </div>
                    <div class="quiz-question">\${quizData.questionText}</div>
                    <input type="text" id="quizAnswer" class="quiz-input" placeholder="\${quizData.placeholder}" \${quizData.requireAnswer ? 'required' : ''}>
                    <div class="quiz-footer">
                        <button id="quizNextBtn" class="btn btn-success" disabled>Next →</button>
                    </div>
                </div>
            \`;
            quizContainer.classList.remove('hidden');
            timer.start();

            document.getElementById('quizNextBtn').addEventListener('click', () => {
                const answer = document.getElementById('quizAnswer').value.trim();
                if (quizData.requireAnswer && !answer) { alert('Please enter an answer before proceeding'); return; }
                window.location.href = \`\${quizData.nextPageUrl}?quizid=\${quizData.nextQuizId}\`;
            });

            if (quizData.requireAnswer) {
                document.getElementById('quizAnswer').addEventListener('input', (e) => {
                    const hasAnswer = e.target.value.trim().length > 0;
                    const timerComplete = timer.timeLeft <= 0;
                    document.getElementById('quizNextBtn').disabled = !(hasAnswer && timerComplete);
                });
            }
        }

        swpForm.dispatchEvent(new Event('submit'));
    </script>
</body>
</html>`;

// Quiz Results HTML
const quizResultsHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Results - Financial Calculator</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>🎉 Quiz Completed!</h1>
            <p>Thank you for participating</p>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <div class="ad-zone ad-header"><small>Advertisement (728×90)</small></div>

            <div class="content-grid">
                <div>
                    <div class="card results-container">
                        <div class="results-icon">🏆</div>
                        <div id="resultsMessage" class="results-message">Loading...</div>
                        <a id="rewardBtn" href="#" class="reward-btn hidden">Get Reward →</a>
                    </div>
                    <div class="ad-zone ad-inline"><small>Advertisement (970×250)</small></div>
                </div>
                <aside>
                    <div class="ad-zone ad-sidebar"><small>Advertisement (300×600)</small></div>
                </aside>
            </div>
        </div>
    </main>

    <script src="/js/utils.js"></script>
    <script>
        const { getQueryParam, fetchQuiz } = window.FinancialCalc;
        const quizId = getQueryParam('quizid');

        if (quizId) {
            loadResults(quizId);
        } else {
            document.getElementById('resultsMessage').innerHTML = '<p>No quiz ID found. Please complete the quiz to see results.</p>';
        }

        async function loadResults(quizId) {
            try {
                const quizData = await fetchQuiz(quizId);
                if (quizData.success && quizData.pageType === 'results') {
                    document.getElementById('resultsMessage').innerHTML = quizData.resultMessage;
                    const rewardBtn = document.getElementById('rewardBtn');
                    rewardBtn.href = quizData.rewardLink;
                    rewardBtn.classList.remove('hidden');
                } else {
                    document.getElementById('resultsMessage').innerHTML = '<p>Invalid quiz or quiz not found.</p>';
                }
            } catch (error) {
                console.error('Failed to load results:', error);
                document.getElementById('resultsMessage').innerHTML = '<p>Error loading results. Please try again.</p>';
            }
        }
    </script>
</body>
</html>`;

// Write files
fs.writeFileSync(path.join(__dirname, 'views', 'swp-calculator.html'), swpCalculatorHTML);
fs.writeFileSync(path.join(__dirname, 'views', 'quiz-results.html'), quizResultsHTML);

console.log('✅ SWP Calculator page created');
console.log('✅ Quiz Results page created');
console.log('🎉 All calculator pages completed!');
console.log('');
console.log('⚠️  Still need to create: admin-dashboard.html');
console.log('You can create this manually or I can generate it for you.');
