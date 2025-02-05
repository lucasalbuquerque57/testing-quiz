// app.js
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const resultsEl = document.getElementById('results');

let currentQuestion = 0;
let score = 0;

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    return data.results;
}

function displayQuestion(question) {
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    
    const options = [...question.incorrect_answers];
    options.splice(Math.floor(Math.random() * 4), 0, question.correct_answer);
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, question.correct_answer);
        optionsEl.appendChild(button);
    });
}

function checkAnswer(selected, correct) {
    const buttons = document.querySelectorAll('.option');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correct) {
            button.style.backgroundColor = '#28a745';
        } else if (button.textContent === selected) {
            button.style.backgroundColor = '#dc3545';
        }
    });

    if (selected === correct) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
    }
    
    nextBtn.classList.remove('hidden');
}

async function startQuiz() {
    const questions = await fetchQuestions();
    
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            nextBtn.classList.add('hidden');
            displayQuestion(questions[currentQuestion]);
        } else {
            showResults();
        }
    });

    displayQuestion(questions[0]);
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultsEl.classList.remove('hidden');
    resultsEl.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your final score: ${score}/10</p>
        <button onclick="location.reload()">Play Again</button>
    `;
}

startQuiz();
