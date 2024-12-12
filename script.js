    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']; 
    let currentQuestion = 0;
    let correctAnswers = 0;
    let selectedMode;
    let totalQuestions = 5;
    let quizData = [];
    let timer;
    let questions = [];
    let userAnswers = [];

    const modes = {
        beginner: { digits: 1, choices: 2, timeLimit: null },
        intermediate: { digits: 1, choices: 10, timeLimit: null },
        advanced: { digits: 3, choices: 10, timeLimit: null },
        expert: { digits: 6, choices: 10, timeLimit: null }
    };

    function startQuiz(mode) {
        if (mode === 'advanced' || mode === 'expert') {
            alert("このモードはまだ未実装です。");
            return;
        }

        selectedMode = mode;
        currentQuestion = 0;
        correctAnswers = 0;
        questions = [];
        userAnswers = [];
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('result').style.display = 'none';
        document.getElementById('quiz-image').style.display = 'none';
        document.getElementById('converter').style.display = 'none';
        generateQuizData();
        showQuestion();
    }

    function generateQuizData() {
        quizData = [];
        for (let i = 0; i < totalQuestions; i++) {
            let questionNumber = generateArabicNumber(modes[selectedMode].digits);
            quizData.push({ question: questionNumber });
            questions.push(questionNumber);
        }
    }

    function generateArabicNumber(digits) {
        let number = '';
        for (let i = 0; i < digits; i++) {
            number += arabicNumbers[Math.floor(Math.random() * 10)];
        }
        return number;
    }

    function showQuestion() {
    const currentQuiz = quizData[currentQuestion];
    const correctAnswer = parseInt(currentQuiz.question.replace(/[٠-٩]/g, d => arabicNumbers.indexOf(d)));
    const questionDiv = document.getElementById('question');
    questionDiv.innerHTML = ''; 

    const problemLabel = document.createElement('span');
    problemLabel.innerText = '問題';
    problemLabel.style.fontSize = '16px'; 
    questionDiv.appendChild(problemLabel);
    
    const br = document.createElement('br'); 
    questionDiv.appendChild(br);

    const problemText = document.createElement('span');
    problemText.innerText = currentQuiz.question;
    problemText.style.fontSize = '140px'; 
    questionDiv.appendChild(problemText);

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    document.getElementById('feedback').style.display = 'none'; 

    let choices = generateChoices(correctAnswer, modes[selectedMode].choices);

    choices.forEach(choice => {
        let button = document.createElement('button');
        button.innerText = choice;
        button.onclick = () => checkAnswer(choice, correctAnswer);
        choicesDiv.appendChild(button);
    });

    if (modes[selectedMode].timeLimit) {
        startTimer(modes[selectedMode].timeLimit);
    }
}

    function generateChoices(correctAnswer, numChoices) {
        if (selectedMode === 'intermediate') {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
            let choices = [correctAnswer];
            while (choices.length < numChoices) {
                let randomChoice = Math.floor(Math.random() * Math.pow(10, modes[selectedMode].digits));
                if (!choices.includes(randomChoice)) {
                    choices.push(randomChoice);
                }
            }
            return choices.sort(() => Math.random() - 0.5); 
        }
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        clearInterval(timer);

        const feedback = document.getElementById('feedback');
        userAnswers.push(selectedAnswer); 
        if (selectedAnswer === correctAnswer) {
            correctAnswers++;
            feedback.innerText = "正解！";
            feedback.style.color = 'green';
        } else {
            feedback.innerText = "不正解...";
            feedback.style.color = 'red';
        }

        feedback.style.display = 'block'; 

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < totalQuestions) {
                showQuestion();
            } else {
                showResult();
            }
        }, 1000);
    }

    function startTimer(seconds) {
        let timeLeft = seconds;
        document.getElementById('timer').innerText = "残り時間: ${timeLeft}秒";
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').innerText = "残り時間: ${timeLeft}秒";
            if (timeLeft <= 0) {
                clearInterval(timer);
                currentQuestion++;
                if (currentQuestion < totalQuestions) {
                    showQuestion();
                } else {
                    showResult();
                }
            }
        }, 1000);
    }

    function showResult() {
        let correctCount = correctAnswers;
        const resultTableBody = document.getElementById('result-table-body');

        resultTableBody.innerHTML = ''; 

        for (let i = 0; i < totalQuestions; i++) {
            const row = document.createElement('tr');
            const questionCell = document.createElement('td');
            questionCell.textContent = questions[i];
            const answerCell = document.createElement('td');
            answerCell.textContent = userAnswers[i];
            const resultCell = document.createElement('td');
            if (parseInt(userAnswers[i]) === parseInt(questions[i].replace(/[٠-٩]/g, d => arabicNumbers.indexOf(d)))) {
                resultCell.textContent = '正解';
            } else {
                resultCell.textContent = '不正解';
            }
            row.appendChild(questionCell);
            row.appendChild(answerCell);
            row.appendChild(resultCell);
            resultTableBody.appendChild(row);
        }

        const accuracy = (correctCount / totalQuestions) * 100;
        document.getElementById('accuracy').textContent = accuracy.toFixed(2);
        document.querySelector('.quiz-container').style.display = 'none';
        document.querySelector('#result').style.display = 'block';
    }

    function restartQuiz() {
        document.getElementById('result').style.display = 'none';
        document.getElementById('mode-selection').style.display = 'block';
        document.getElementById('quiz-image').style.display = 'block';
        document.getElementById('converter').style.display = 'block';
    }

document.getElementById('arabic-numerals').addEventListener('input', function(event) {

    let inputValue = event.target.value;

    inputValue = inputValue.replace(/[\uFF10-\uFF19]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
    });

    event.target.value = inputValue;
});

const arabicDigitsMap = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩'
};

function convertToArabic() {
    const input = document.getElementById('arabic-numerals').value.trim(); 
    if (input === '') {
        alert('入力が空です。アラビア数字を入力してください。');
        return; 
    }

    let result = '';

    for (const char of input) {
        if (arabicDigitsMap[char] !== undefined) {
            result += arabicDigitsMap[char];
        } else {
            result += char; 
        }
    }

    document.getElementById('converted-result').innerText = result;
}
