    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']; // アラビア語の数字
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
            return; // 処理を終了
        }

        selectedMode = mode;
        currentQuestion = 0;
        correctAnswers = 0;
        questions = [];
        userAnswers = [];
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('result').style.display = 'none'; // 結果画面を非表示
        document.getElementById('quiz-image').style.display = 'none';
        generateQuizData();
        showQuestion();
    }

    function generateQuizData() {
        quizData = [];
        for (let i = 0; i < totalQuestions; i++) {
            let questionNumber = generateArabicNumber(modes[selectedMode].digits);
            quizData.push({ question: questionNumber });
            questions.push(questionNumber); // 問題を記録
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
    questionDiv.innerHTML = ''; // 既存の内容をクリア

    // 「問題:」を小さく表示し、その後に改行して問題文を表示
    const problemLabel = document.createElement('span');
    problemLabel.innerText = '問題';
    problemLabel.style.fontSize = '16px'; // 「問題:」のサイズを小さく
    questionDiv.appendChild(problemLabel);
    
    const br = document.createElement('br'); // 改行
    questionDiv.appendChild(br);

    const problemText = document.createElement('span');
    problemText.innerText = currentQuiz.question;
    problemText.style.fontSize = '140px'; // 問題のサイズは普通に設定
    questionDiv.appendChild(problemText);

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    document.getElementById('feedback').style.display = 'none'; // 正誤表示を非表示

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
            return choices.sort(() => Math.random() - 0.5); // シャッフル
        }
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        clearInterval(timer);

        const feedback = document.getElementById('feedback');
        userAnswers.push(selectedAnswer); // ユーザーの回答を記録
        if (selectedAnswer === correctAnswer) {
            correctAnswers++;
            feedback.innerText = "正解！";
            feedback.style.color = 'green';
        } else {
            feedback.innerText = "不正解...";
            feedback.style.color = 'red';
        }

        feedback.style.display = 'block'; // 正誤表示を表示

        // 1秒後に次の問題に進む
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

        resultTableBody.innerHTML = ''; // 既存の内容をクリア

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
    }
