
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
            message: "Words Scrambled!",
            triggered: false
        }
    },
    {
        name: 'Robert Frost',
        hp: 120,
        maxHp: 120,
        quotes: [
            'Two roads diverged in a yellow wood',
            'The woods are lovely dark and deep',
            'Miles to go before I sleep',
            "In three worsd I can sum up everythign I have learned about life, it goes on",
            "Good fences make good neighbours"
         
        ],
        specialAttack: {
            threshold: 0.4,
            message: "The screen darkens!",
            triggered: false
        }
    },
    {
        name: 'Edgar Allan Poe',
        hp: 150,
        maxHp: 150,
        quotes: [
            "Quoth the raven nevermore",
            "All that we see or seem is but a dream within a dream",
            "Deep into that darkness peering long I stood there wondering fearing",
            "The boundaries which devide Life from Death are at best shadowy and vauge",
            "I became insane with long intervals of horrible sanity"
        ],
        specialAttack: {
            threshold: 0.3,
            message: "Letters swapped!",
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



let currentBossIndex = 0;
let currentQuoteIndex = 0;
let bossHP = 100;
let maxBossHP = 100;
let bossDefeated = false;
let gameWon = false;


const textDisplay = document.getElementById('textDisplay');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('resetBtn');
const hint = document.getElementById('hint');
const bossNameEl = document.getElementById('bossName');
const bossHpText = document.getElementById('bossHpText');
const bossHealthFill = document.getElementById('bossHealth');


function loadBoss(index) {
    const boss = bosses[index];
    bossNameEl.textContent = boss.name;
    bossHP = boss.hp;
    maxBossHP = boss.maxHp;
    bossDefeated = false;
    boss.specialAttack.triggered = false;
    gameWon = false;

    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    isFinished = false;
    startTime = null;
    clearInterval(timerInterval);

    timerDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    textDisplay.style.borderColor = '#2a2a4a';
    hint.classList.remove('hidden');
    hint.textContent = 'Click to start typing';
    document.querySelector('.boss-section').classList.remove('boss-defeated');

    currentQuoteIndex = 0;
    loadQuote();
    updateBossHealth();
    textDisplay.focus();

}

function loadQuote() {
    const boss = bosses[currentBossIndex];
    if (currentQuoteIndex >= boss.quotes.length) {
        bossDefeated = true;
        gameWon = true;
        document.querySelector('.boss-section').classList.add('boss-defeated');
        bossNameEl.textContent = 'WIN ' + boss.name + ' DEFEATED!';
        hint.textContent = 'You win! Click "New Fight" to continue';
        hint.classList.remove('hidden');
        isFinished = true;
        return;
    }

    currentText = boss.quotes[currentQuoteIndex];
    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    isFinished = false;
    startTime = null;
    clearInterval(timerInterval);
    timerDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    textDisplay.style.borderColor = '#2a2a4a';
    hint.classList.remove('hidden');
    hint.textContent = 'Click to start typing';
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
    accuracyDisplay.textContent = accuracy;
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

function damageBoss(damage) {
    bossHP = Math.max(0, bossHP - damage);
    updateBossHealth();
    showDamageNumber(damage);

    if (bossHP <= 0) {
        bossDefeated = true;
        document.querySelector('.boss-section').classList.add('boss-defeated');
        bossNameEl.textContent = 'WIN ' + bosses[currentBossIndex].name + ' DEFEATED!';
        hint.textContent = 'Boss down! Moving to next quote...';
        hint.classList.remove('hidden');
        isFinished = true;
        setTimeout(() => {
            currentQuoteIndex++;
            loadQuote();
        }, 1500);
    }

}

function showDamageNumber(damage) {
    const el = document.createElement('div');
    el.className = 'damage-number';
    el.textContent = `-${damage}`;
    const bossSection = document.querySelector('.boss-section');
    const rect = bossSection.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
    el.style.top = (rect.top - 5) + 'px';
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
        setTimeout(() => el.remove(), 400);

    }, 1800);
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

function shareScore() {
    const wpm = wpmDisplay.textContent;
    const accuracy = accuracyDisplay.textContent;
    const bossName = bosses[currentBossIndex].name;
    const status = gameWon ? 'DEFEATED' : 'IN PROGRESS';
    const shareText = `Typing Battles\n\nBoss: ${bossName}\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nStatus: ${status}\n\nCan you beat my score?`
    
    if (navigator.share) {
        navigator.share({
            title: 'Typing Battles Score',
            text: shareText,
        }).catch(() => {
            prompt('Copy this to share:', shareText);

        
        });
    }
}


textDisplay.addEventListener('keydown', function(e) {

    if (isFinished || bossDefeated) return;
    if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    if (!startTime) {
        isActive = true;
        hint.classList.add('hidden');
    }

    if (charIndex >= currentText.length) {
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

    if (charIndex >= currentText.length && !bossDefeated) {
        isFinished = true;
        currentQuoteIndex++;
        setTimeout(() => {
            loadQuote();
        }, 800);
    }
});

textDisplay.addEventListener('click', function() {
    textDisplay.focus();

});

resetBtn.addEventListener('click', function() {
       currentQuoteIndex = 0;
       currentBossIndex = 0;
       bosses.forEach(b => b.specialAttack.triggered = false);
       loadBoss(0);
       textDisplay.focus();
    });

shareBtn.addEventListener('click', shareScore);

loadBoss(0);
console.log('Type to defeat the boss!')


