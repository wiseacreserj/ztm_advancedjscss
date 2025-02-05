const TRIVIA_API_URL =
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
const PANTRY_API_URL = "https://ztm-advancedjscss.vercel.app/quiz-scores";

const quizBox = document.getElementById("quiz-box");
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const timerDisplay = document.getElementById("time-left");
const choicesContainer = document.getElementById("choices-container");
const nextBtn = document.getElementById("next-btn");
const loader = document.getElementById("loader");
const highScoreContainer = document.getElementById("high-score-container");
const highScoresList = document.getElementById("high-scores-list");
const playAgainBtn = document.getElementById("play-again-btn");

let currentQuestion = 0;
let questions = [];
let totalScore = 0;
let timerInterval;
let startTime;
const totalTime = 10000;

//Fetch questions

async function fetchQuestions() {
    try {
        const response = await fetch(TRIVIA_API_URL);
        const data = await response.json();
        questions = data.results;
        console.log(data.results);
        loadQuestion();
    } catch (error) {
        console.log("Error:", error);
        questionText.innerText =
            "Failed to load questions. Please try again later";
    }
}

//Load each question to UI
function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.innerText = decodeHTML(question.question);
    questionNumber.innerText = `Question ${currentQuestion + 1}`;

    //Reset choices container
    choicesContainer.innerText = "";
    nextBtn.disabled = true;

    //Prepare choices
    const choices = [
        ...question.incorrect_answers,
        question.correct_answer,
    ].sort(() => Math.random() - 0.5);
    choices.forEach((choice) => {
        choice = choice.trim();
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("choice");
        button.innerText = decodeHTML(choice);
        button.onclick = () =>
            checkAnswer(choice, question.correct_answer.trim());
        choicesContainer.appendChild(button);
    });

    resetTimer();
    startTimer();
}

//Load next question
nextBtn.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
});

//Ensure special characters are decoded
function decodeHTML(html) {
    const txt = document.createElement("div");
    txt.innerHTML = html;
    return txt.textContent;
}

//Start timer for question
function startTimer() {
    startTime = Date.now();
    let timeLeft = totalTime;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timeLeft = totalTime - elapsedTime;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeLeft = 0;
            updateTimerDisplay(timeLeft);
            disableChoice();
            nextBtn.disabled = false;
            const correctAnswer = questions[currentQuestion].correct_answer;
            highlightCorrectAnswer(correctAnswer);
        } else {
            updateTimerDisplay(timeLeft);
        }
    }, 50);
}

//Update timer UI
function updateTimerDisplay(timeLeft) {
    const seconds = (timeLeft / 1000).toFixed(2);
    timerDisplay.innerText = seconds;
}

//Reset timer to 10s
function resetTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay(totalTime);
}

//Check if answer is correct
function checkAnswer(selectedAnswer, correctAnswer) {
    clearInterval(timerInterval);
    disableChoice();

    const choices = document.querySelectorAll(".choice");
    choices.forEach((choice) => {
        if (choice.innerText === decodeHTML(correctAnswer)) {
            choice.classList.add("correct");
        } else {
            choice.classList.add("wrong");
        }
        choice.disabled = true;
    });

    if (selectedAnswer === correctAnswer) {
        const elapsedTime = Date.now() - startTime;
        const timeLeft = totalTime - elapsedTime;
        const weightedScore = Math.floor((timeLeft / totalTime) * 1000);
        totalScore += weightedScore;
        console.log(weightedScore);
        console.log(totalScore);
    }

    nextBtn.disabled = false;
}

//Disable choices whet time expires or choice selected
function disableChoice() {
    const choices = document.querySelectorAll(".choice");
    choices.forEach((choice) => {
        choice.disabled = true;
    });
}

//Highlight correct answer
function highlightCorrectAnswer(correctAnswer) {
    const choices = document.querySelectorAll(".choice");
    choices.forEach((choice) => {
        if (choice.innerText === decodeHTML(correctAnswer)) {
            choice.classList.add("correct");
        }
    });
}

//Startup
fetchQuestions();
