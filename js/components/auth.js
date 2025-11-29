let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;

async function loadQuestions() {
    try {
        console.log("Loading questions...");
        const response = await fetch("./questions.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Questions data loaded:", data);
        questions = data.mcq.concat(data.yesno); // Combine all question types
        loadQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById('question').textContent = "Failed to load questions. Please check the console for details.";
    }
}


function loadQuestion() {
    try {
        if (!questions || questions.length === 0) {
            throw new Error("No questions available");
        }
        
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) {
            throw new Error("Invalid question index");
        }

        document.getElementById('question').textContent = currentQuestion.question;
        
        const optionsContainer = document.getElementById('options');
        if (!optionsContainer) {
            throw new Error("Options container not found");
        }
        
        optionsContainer.innerHTML = ""; // Clear previous options

        currentQuestion.options.forEach(opt => {
            const button = document.createElement("button");
            button.textContent = opt;
            button.onclick = () => selectAnswer(opt);
            optionsContainer.appendChild(button);
        });
    } catch (error) {
        console.error("Error loading question:", error);
        document.getElementById('question').textContent = "Error loading question. Please check the console.";
    }
}


function selectAnswer(answer) {
    selectedAnswer = answer;
    document.querySelectorAll(".options button").forEach(btn => btn.style.backgroundColor = "");
    event.target.style.backgroundColor = "#FFFF00";
}

function submitAnswer() {
    const feedback = document.getElementById('feedback');
    if (selectedAnswer === null) {
        feedback.textContent = "Please select an answer.";
        return;
    }

    const correctAnswer = questions[currentQuestionIndex].correct;

    if (selectedAnswer === correctAnswer) {
        feedback.innerHTML = `<strong>Great job!</strong> You got it right: ${selectedAnswer}`;
        feedback.style.color = "green";
        feedbackImage.src = "C:\ITLS\images\Untitled design.png";
    } else {
        feedback.innerHTML = `<strong>Oops!</strong> You selected: ${selectedAnswer}. Correct answer: ${correctAnswer}`;
        feedback.style.color = "red";
        feedbackImage.src = "images/pngegg (1).png";
    }

    feedbackImage.style.display = "block"; // Show feedback image
    feedback.classList.add('fade');
    updateProgress();


    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        setTimeout(loadQuestion, 1000);
    } else {
        feedback.textContent = "Test Completed!";
    }
}

loadQuestions();
