const categoryElement = document.getElementById("category-id");
const difficultyElement = document.getElementById("difficulty-id");
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const timerElement = document.getElementById("time-left");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const startTest = async () => {
    const selectedCategory = categoryElement.options[categoryElement.selectedIndex].value;
    const selectedDifficulty = difficultyElement.options[difficultyElement.selectedIndex].value;
    
    const URL = `https://opentdb.com/api.php?amount=20&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
    
    try {
        const response = await fetch(URL, { method: "GET" });
        const data = await response.json();
        localStorage.setItem("quizData", JSON.stringify(data.results));
        window.location.href = "quiz-page.html";
    } catch (error) {
        console.error("Error fetching quiz data:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    questions = JSON.parse(localStorage.getItem("quizData")) || [];
    if (questions.length > 0) {
        showQuestion();
    }
});

function showQuestion() {
    clearTimeout(timer);
    nextButton.disabled = true;
    const questionData = questions[currentQuestionIndex];
    questionElement.textContent = questionData.question;
    optionsContainer.innerHTML = "";
    
    questionData.incorrect_answers.concat(questionData.correct_answer)
        .sort(() => Math.random() - 0.5)
        .forEach(answer => {
            const button = document.createElement("button");
            button.textContent = answer;
            button.classList.add("option-button");
            button.onclick = () => selectAnswer(button, questionData.correct_answer);
            optionsContainer.appendChild(button);
        });
    
    startTimer();
}
const timerContainer = document.getElementById("timer"); 
function startTimer() {
    let timeLeft = 15;
    timerElement.textContent = timeLeft;
    timerContainer.classList.remove("low-time", "blink");
    timerContainer.style.backgroundColor = "#ffcc00"; 

    clearInterval(timer); 

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 7) {
            timerContainer.classList.add("blink"); 
        }

        if (timeLeft <= 5) {
            timerContainer.classList.add("low-time"); 
            timerContainer.style.backgroundColor = "#ff4d4d";
            timerContainer.style.color = "white";
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}


function selectAnswer(button, correctAnswer) {
    clearInterval(timer);
    const buttons = document.querySelectorAll(".option-button");
    buttons.forEach(btn => btn.disabled = true);
    
    if (button.textContent === correctAnswer) {
        button.style.backgroundColor = "#2ea043";
        score++;
        scoreElement.textContent = `${score}`;
    } else {
        button.style.backgroundColor = "#ff4d4d";
        showCorrectAnswer();
    }
    nextButton.disabled = false;
}

function showCorrectAnswer() {
    document.querySelectorAll(".option-button").forEach(btn => {
        if (btn.textContent === questions[currentQuestionIndex].correct_answer) {
            btn.style.backgroundColor = "#2ea043";
        }
    });
    nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.textContent = `Quiz Over! Your score: ${score}`;
        optionsContainer.innerHTML = "";
        nextButton.style.display = "none";
        restartButton.style.display = "block";
    }
});

const restart_test = () => {
    window.location.href = "index.html"
}
