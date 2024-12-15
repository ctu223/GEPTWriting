// 寫作情境題目
const writingPrompts = [
    {
        image: 'images/situation1.png',
        situation: "Neil is having a vacation in Los Angeles. Look at the pictures and write about his experience in about 50 words.",
        minWords: 50,
        hints: [
            'What did he do on Friday?',
            'What did he do on Saturday?',
            'What did he do on Sunday?',
            'Use proper time expressions',
            'Use past tense to describe the activities'
        ]
    },
    {
        image: 'images/situation2.png',
        situation: "Kenting is one of the most famous tourist spots in Taiwan. Dan had a great time there. Look at the pictures and write about his experience in about 50 words.",
        minWords: 50,
        hints: [
            'What activities did he do?',
            'Describe the sequence of activities',
            'Use proper connecting words',
            'Express his feelings about the activities'
        ]
    },
    {
        image: 'images/situation3.png',
        situation: "Nancy doesn't have classes on Saturdays, but last Saturday she made a mistake. Look at the pictures and write about what happened in about 50 words.",
        minWords: 50,
        hints: [
            'Describe what she did in sequence',
            'Explain her mistake',
            'Use time expressions',
            'Use past tense properly'
        ]
    },
    {
        image: 'images/situation4.png',
        situation: "Eric had a date with his girlfriend at 12:00 noon, but he ran into some trouble. Look at the pictures and write about what happened in about 50 words.",
        minWords: 50,
        hints: [
            'Describe the sequence of events',
            'Mention the specific times',
            'Explain what went wrong',
            'Use past tense to tell the story'
        ]
    },
    {
        image: 'images/situation5.png',
        situation: "Frank visited Shilin Night Market yesterday. Look at the pictures and write about his experience in about 50 words.",
        minWords: 50,
        hints: [
            'List what food he ate',
            'Describe the food',
            'Express his feelings about the food',
            'Use proper sequence words'
        ]
    }
];

let currentQuestionIndex = 0;
let timer = null;
let timeLeft = 900; // 15 minutes in seconds

// DOM 元素
const timerDisplay = document.getElementById('timer');
const situationImage = document.getElementById('situation-image');
const questionContent = document.getElementById('question-content');
const answerInput = document.getElementById('answer-input');
const wordCount = document.getElementById('word-count');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const grammarCheckSection = document.getElementById('grammar-check-section');
const grammarSuggestions = document.getElementById('grammar-suggestions');
const correctedText = document.getElementById('corrected-text');

// 更新計時器顯示
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `剩餘時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        submitAnswer();
    } else {
        timeLeft--;
    }
}

// 開始計時
function startTimer() {
    timeLeft = 900; // 重置為15分鐘
    updateTimer();
    timer = setInterval(updateTimer, 1000);
}

// 載入題目
function loadQuestion() {
    const currentPrompt = writingPrompts[currentQuestionIndex];
    
    // 載入情境圖片
    situationImage.innerHTML = `<img src="${currentPrompt.image}" alt="Situation ${currentQuestionIndex + 1}">`;
    
    // 載入題目內容
    questionContent.innerHTML = `
        <p><strong>Situation:</strong> ${currentPrompt.situation}</p>
        <div class="hints">
            <p><strong>Writing Tips:</strong></p>
            <ul>
                ${currentPrompt.hints.map(hint => `<li>${hint}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // 重置答案區
    answerInput.value = '';
    updateWordCount();
    
    // 隱藏文法檢查區
    grammarCheckSection.style.display = 'none';
    
    // 重置按鈕狀態
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    startBtn.disabled = false;
    answerInput.disabled = true;
}

// 開始作答
function startWriting() {
    startBtn.disabled = true;
    submitBtn.disabled = false;
    answerInput.disabled = false;
    startTimer();
    answerInput.focus();
}

// 更新字數計算
function updateWordCount() {
    const words = answerInput.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = `字數：${words.length}`;
    return words.length;
}

// 檢查文法（這裡使用簡單的示例檢查）
function checkGrammar(text) {
    const suggestions = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
        const words = sentence.trim().split(/\s+/);
        
        // 檢查句子開頭是否大寫
        if (words[0] && words[0][0] !== words[0][0].toUpperCase()) {
            suggestions.push(`Sentence ${index + 1} should start with a capital letter.`);
        }
        
        // 檢查時態（簡單的過去式檢查）
        if (sentence.includes('yesterday') || sentence.includes('last')) {
            if (!words.some(word => word.endsWith('ed'))) {
                suggestions.push(`Sentence ${index + 1} might need past tense verbs.`);
            }
        }
        
        // 檢查冠詞使用
        words.forEach((word, i) => {
            if (['a', 'an'].includes(word.toLowerCase())) {
                const nextWord = words[i + 1];
                if (nextWord && /^[aeiou]/i.test(nextWord)) {
                    if (word.toLowerCase() === 'a') {
                        suggestions.push(`Use "an" instead of "a" before "${nextWord}"`);
                    }
                }
            }
        });
    });
    
    return suggestions;
}

// 提交答案
function submitAnswer() {
    clearInterval(timer);
    const answer = answerInput.value.trim();
    const wordCount = updateWordCount();
    const currentPrompt = writingPrompts[currentQuestionIndex];
    
    if (wordCount < currentPrompt.minWords) {
        alert(`請至少寫 ${currentPrompt.minWords} 字！`);
        return;
    }
    
    // 進行文法檢查
    const grammarErrors = checkGrammar(answer);
    grammarCheckSection.style.display = 'block';
    
    if (grammarErrors.length > 0) {
        grammarSuggestions.innerHTML = '<ul>' + 
            grammarErrors.map(error => `<li>${error}</li>`).join('') + 
            '</ul>';
    } else {
        grammarSuggestions.innerHTML = '<p>No grammar errors found!</p>';
    }
    
    // 顯示修改後的文字
    correctedText.innerHTML = `<p><strong>Your Text:</strong></p><p>${answer}</p>`;
    
    // 禁用相關按鈕和輸入
    submitBtn.disabled = true;
    answerInput.disabled = true;
    nextBtn.disabled = false;
}

// 下一題
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < writingPrompts.length) {
        loadQuestion();
    } else {
        alert('恭喜！您已完成所有題目！');
        nextBtn.disabled = true;
    }
}

// 事件監聽器
answerInput.addEventListener('input', updateWordCount);
startBtn.addEventListener('click', startWriting);
submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', nextQuestion);

// 初始化載入第一題
loadQuestion();
