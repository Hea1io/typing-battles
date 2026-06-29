const texts = [
    "The quick brown fox jumps over the lazy dog",
    "Typing is a fundamental skill in the digital age",
    "Practice makes perfect when learning to type",
    "Speed and accuracy are the keys to mastery",
    "The more you type the better you become",
    "In the middle of difficulty lies opportunity",
    "The only way to do great work is to love what you do"
];

const bosses = [
    {

        name: 'William Shakespeare',
        hp: 100,
        maxHp: 100,
        quotes: [
            "To be or not to be that is the question",
            "All the world's a stage and all the men and women merely players",
            "These violent delights have violent ends",
            "Love looks not with the eyes but with the mind",
            "Parting is such sweet sorrow"
        ],
        specialAttack: {
            threshold: 0.5,
            message: "'Parting is such a sweet sorrow!' - Words Scramble!",
            triggered: false
        }
    }
];
let currentText = '';
let charIndex = 0;
let mistakes = 0;
let totalChars = 0;
let startTime = null;
let timerInterval = null;
let isFinished = false;
let isActive = false; 
let gameMode = 'boss';

let currentBossIndex = 0;
let bossHP = 100;
let maxBossHP = 100;
let bossDefeated = false;

const menuSection = document.getElementById('menuSection');
const gameSection = document.getElementById('gameSection');
const modeTitle = document.getElementById('modeTitle');
const bossSection = document.getElementById('bossSection');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const bossModeBtn = document.getElementById('bossModeBtn');
const practiceModeBtn = document.getElementById('practiceModeBtn');

const textDisplay = document.getElementById('textDisplay');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('resetBtn');
const hint = document.getElementById('hint');
const nextBossBtn = document.getElementById('nextBossBtn');

const bossNameEl = document.getElementById('bossName');
const bossHpText = document.getElementById('bossHpText');
const bossHealthFill = document.getElementById('bossHealth');

function showMenu() {
    menuSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    document.querySelector('.container').style.minHeight = "500px";
}

function showGame(mode) {
    gameMode = mode;
    menuSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    document.querySelector('.container').style.minHeight = "auto";

    if (mode === "boss") {
        modeTitle.textContent = 'Boss Battle';
        bossSection.classList.remove('hidden');
        document.querySelector('.mode-badge')?.remove();
        const badge = document.createElement('span');
        badge.className = 'mode-badge boss-mode';
        badge.textContent = 'Boss Mode';
        modeTitle.parentNode.insertBefore(badge, modeTitle.nextSibling);
        loadBoss(currentBossIndex);
    } else {
        modeTitle.textContent = 'WPM Practice';
        bossSection.classList.add('hidden');
        document.querySelector(".mode-badge")?.remove();
        const badge = document.createElement('span');
        badge.className = 'mode-badge';
        badge.textContent = 'Practice';
        modeTitle.parentNode.insertBefore(badge, modeTitle.nextSibling);
        loadPracticeText();
    }
    textDisplay.focus();
}

function loadPracticeText() {
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
    wpmDisplay.textContent ='0';
    accuracyDisplay.textContent ='100%';
    textDisplay.style.borderColor = "#2a2a4a";
    hint.classList.remove('hidden');
    hint.textContent = 'Click the text above to start typing';
    nextBossBtn.disabled = true;

    renderText(); 
}

function loadBoss(index) {
    const boss = bosses[index];
    bossNameEl.textContent = boss.name;
    bossHP = boss.hp;
    maxBossHP = boss.maxHp;
    bossDefeated = false;
    boss.specialAttack.triggered = false;

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
    textDisplay.style.borderColor = '#2a2a4a';
    hint.classList.remove('hidden');
    hint.textContent = 'Click the text above to start typing';
    nextBossBtn.disabled = true;

    document.querySelector('.boss-section').classList.remove('boss-defeated');

    const randomIndex = Math.floor(Math.random() * boss.quotes.length);
    currentText = boss.quotes[randomIndex];

    updateBossHealth();
    renderText();
}

function updateBossHealth(){
    const percent = Math.max(0, (bossHP / maxBossHP) * 100);
    bossHealthFill.style.width = percent + "%";
    bossHpText.textContent = `HP : ${Math.max(0, Math.floor(bossHP))}/${maxBossHP}`

    if (percent <= 25) {
        bossHealthFill.classList.add('low');

    } else {
        bossHealthFill.classList.remove('low');

    }
}

function damageBoss(damage) {
    bossHP = Math.max(0, bossHP - damage);
    updateBossHealth();
    showDamageNumber(damage);

    if (bossHP <= 0) {
        bossDefeated = true;
        document.querySelector('.boss-section').classList.add('boss-defeated');
        bossNameEl.textContent = 'WIN ' + bosses[currentBossIndex].name + ' DEFEATED!';
        nextBossBtn.disabled = false;
        finishRound();
    }
}

function showDamageNumber(damage) {
    const el = document.createElement('div');
    el.className = 'damage-number';
    el.textContent = `-${damage}`;

    const bossSection = document.querySelector('.boss-section');
    const rect = bossSection.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2 - 30) + 'px';
    el.style.top = (rect.top - 10) + 'px';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function showBossMessage(message) {
    const el = document.createElement('div');
    el.className = 'boss-message';
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
        el.classList.add('fade-out');
        setTimeout(() => el.remove(), 500);

    }, 2000);
}

function triggerSpecialAttack() {
    const boss = bosses[currentBossIndex];
    if (boss.specialAttack.triggered) return;

    const hpPercent = bossHP / maxBossHP;
    if (hpPercent <= boss.specialAttack.threshold) {
        boss.specialAttack.triggered = true;

        showBossMessage(boss.specialAttack.message);

        const flash = document.createElement('div');
        flash.className = 'boss-attack-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

        scrambleRemainingText();
    }
}

function scrambleRemainingText() {
    const charSpans = textDisplay.querySelectorAll('.char');
    const remainingChars = [];

    charSpans.forEach((span,i) => {
        if (i >= charIndex && !span.classList.contains('correct')) {
            remainingChars.push(span.textContent);
        }
    });

    for (let i = remainingChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingChars[i], remainingChars[j]] = [remainingChars[j], remainingChars[i]];
    }

    let idx = 0;
    charSpans.forEach((span, i) => {
        if (i >= charIndex && !span.classList.contains('correct')) {
            span.textContent = remainingChars[idx++];
        }
    });
}
function loadText() {

    loadBoss(currentBossIndex);
    
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

        const wpm = parseInt(wpmDisplay.textContent) || 0;
        let damage = 1;
        if (wpm > 60) damage = 3;
        else if (wpm > 40) damage = 2;
        else if (wpm > 20) damage = 1.5;

        damageBoss(Math.round(damage));

        triggerSpecialAttack();

    
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

bossModeBtn.addEventListener('click', function() {
    showGame('boss');
});

practiceModeBtn.addEventListener('click', function() {
    showGame('practice');
});

backToMenuBtn.addEventListener('click', function() {
    clearInterval(timerInterval);
    showMenu();
});

resetBtn.addEventListener('click', function() {
        if (gameMode === 'boss') {
            loadBoss(currentBossIndex);

        } else {
            loadPracticeText();
        }
        textDisplay.style.borderColor = '#2a2a4a';
        textDisplay.focus();
    });

    
nextBossBtn.addEventListener('click', function() {
    if (currentBossIndex < bosses.length - 1) {
        currentBossIndex++;
        loadBoss(currentBossIndex);
        textDisplay.focus();
    } else {
        alert('You beat all the bosses! You are the true typing master!');
        currentBossIndex = 0;
        loadBoss(0);
        textDisplay.focus();
    } 
        
    });

    showMenu();
  
    console.log('shakespeare is here')
    
