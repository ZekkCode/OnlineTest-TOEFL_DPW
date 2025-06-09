// filepath: /TestOnline-TOEFL/TestOnline-TOEFL/src/js/test.js
let currentQuestionIndex = 0;
let score = 0;
let timer;
const totalQuestions = 100; // Adjust based on the actual number of questions

// Load questions from JSON file
async function loadQuestions() {
    const response = await fetch('assets/data/questions.json');
    const questions = await response.json();
    return questions;
}

// Display the current question
function displayQuestion(questions) {
    const questionContainer = document.getElementById('question-container');
    const question = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <h2>${question.question}</h2>
        <ul>
            ${question.options.map((option, index) => `
                <li>
                    <button onclick="checkAnswer(${index})">${option}</button>
                </li>
            `).join('')}
        </ul>
    `;
}

// Check the selected answer
function checkAnswer(selectedIndex) {
    const questions = await loadQuestions();
    if (selectedIndex === questions[currentQuestionIndex].correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        displayQuestion(questions);
    } else {
        endTest();
    }
}

// Start the timer
function startTimer(duration) {
    let timeRemaining = duration;
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endTest();
        } else {
            timeRemaining--;
            document.getElementById('timer').innerText = `Time Remaining: ${timeRemaining} seconds`;
        }
    }, 1000);
}

// End the test and display the score
function endTest() {
    clearInterval(timer);
    alert(`Test finished! Your score: ${score}/${totalQuestions}`);
}

// Initialize the test
async function initTest() {
    const questions = await loadQuestions();
    displayQuestion(questions);
    startTimer(300); // 5 minutes timer
}

// Call initTest when the page loads
window.onload = initTest;