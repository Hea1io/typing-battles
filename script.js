const texts = [
    "The quick brown fox jumps over the lazy dog",
    "Typing is a fundamental skill in the digital age",
    "Practice makes perfect when learning to type",
    "Speed and accuracy are the keys to mastery",
    "The more you type the better you become"
];

let currentText = '';
let charIndex = 0;
let mistakes = 0;
let totalChars = 0;
let startTime = null;
let timerInterval = null;
let isFinished = false;
let isActive = false; 

const textDisplay = document.getElementById('textDisplay');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('resetBtn');
const hint = document.getElementById('hint');

function loadText() {
    const randomIndex = Math.floor(Math.random() * texts.length);
    currentText = texts[randomIndex];
    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    isFinished = false;
    isActive = false;
    startTime = null;
    clearInterval(timerInterval); 
    timerDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    textDisplay.style.borderColor = "#2a2a4a";
    hint.classList.remove('hidden');
    hint.textContent = 'Click the text above to start typing';
   
    renderText();
    
}

function renderText() {
    textDisplay.innerHTML = '';
    for (let i = 0; i < currentText.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = currentText[i];
        if (i === 0 ) span.classList.add('current');
        textDisplay.appendChild(span);
    }
}

function updateStats() { 
    if (!startTime) return;

    const elapsed = (Date.now() - startTime) / 1000 / 60;
    const typedChars = charIndex;
    const wpm = elapsed > 0 ? Math.round((typedChars / 5) / elapsed) : 0;
    const accuracy = totalChars > 0  ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + "%";
}

function startTimer() {
    if (timerInterval) return;
    startTime = Date.now();
    timerInterval = setInterval(() => {
        if (startTime) {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = seconds;
            updateStats();
        }
       }, 500);
    }

function finishRound() {
    if (isFinished) return;
    isFinished = true;
    clearInterval(timerInterval);
    textDisplay.style.borderColor = "#4ecdc4";
    hint.textContent = "Complete! Press 'New Text' to try again";
    hint.classList.remove('hidden');
}

textDisplay.addEventListener('keydown', function(e) {

    if (isFinished) {
        return;
    }

    if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) {
        return;
    }

    e.preventDefault();

    if (!startTime && !isFinished) {
        startTimer();
        isActive = true;
        hint.classList.add('hidden');
    }

    if (charIndex >= currentText.length) {
        finishRound();
        return;
    }

    const typedChar = e.key;
    const expectedChar = currentText[charIndex];

    const charSpans = textDisplay.querySelectorAll('.char');
    const currentSpan = charSpans[charIndex];

    charSpans.forEach(span => span.classList.remove('current'));

    if (typedChar === expectedChar) {
        currentSpan.classList.add('correct');
        currentSpan.classList.remove('incorrect');
        charIndex++;
        totalChars++;
    } else {
        currentSpan.classList.add('incorrect');
        mistakes++;
        totalChars++;

        textDisplay.style.borderColor = "#ff6b6b66";
        setTimeout(() => {
            if (!isFinished) textDisplay.style.borderColor = '#2a2a4a';
        }, 150);
    }

    if (charIndex < charSpans.length) {
        charSpans[charIndex].classList.add('current');
    }

    updateStats();

    if (charIndex >= currentText.length) {
        finishRound();
    }
});

textDisplay.addEventListener('click', function() {
    textDisplay.focus();
});


    resetBtn.addEventListener('click', function() {
        loadText();
        textDisplay.style.borderColor = '#2a2a4a';
        typingDisplay.focus();

    });

    loadText();

    console.log('core typing code works')
    
