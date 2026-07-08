
const bosses = [
    {
        name: 'William Shakespeare',
        icon: '📜',
        image: 'images/shakey.jpeg',
        hp: 800,
        maxHp: 800,
        quotes: [
            "To be or not to be that is the question",
            "All the world's a stage and all the men and women merely players",
            "These violent delights have violent ends",
            "Love looks not with the eyes but with the mind",
            "Parting is such sweet sorrow",
            "The better part of valor is discretion",
            "Brevity is the soul of wit",
            "Whats in a name that which we call a rose by any other name would smell as sweet",
            "All that glitters is not gold",
            "The course of true love never did run smooth"
        ],
        specialAttack: {
            threshold: 0.5,
            message: "Words Scrambled!",
            triggered: false
        }
    },
    {
        name: 'Robert Frost',
        icon: '❄️',
        image: 'images/bert.jpeg',
        hp: 900,
        maxHp: 900,
        quotes: [
            'Two roads diverged in a yellow wood',
            'The woods are lovely dark and deep',
            'Miles to go before I sleep',
            "In three words I can sum up everything I have learned about life, it goes on",
            "Good fences make good neighbors",
            "The best way out is always through",
            "Half the world is composed of people who have something to say and can't",
            "A poem begins as a lump in the throat",
            "Home is the place where when you have to go there they have to take you in",
            "Happiness makes up in height for what it lacks in length"
         
        ],
        specialAttack: {
            threshold: 0.4,
            message: "The screen darkens!",
            triggered: false
        }
    },
    {
        name: 'Edgar Allan Poe',
        icon: '🥀',
        image: 'images/Poe.jpeg',
        hp: 1000,
        maxHp: 1000,
        quotes: [
            "Quoth the raven nevermore",
            "All that we see or seem is but a dream within a dream",
            "Deep into that darkness peering long I stood there wondering fearing",
            "The boundaries which divide Life from Death are at best shadowy and vague",
            "I became insane with long intervals of horrible sanity",
            "Believe nothing you hear and only half of what you see",
            "There is no beauty without some strangeness",
            "Words have no power to impress the mind without exquisite horror",
            "The scariest monsters are the ones that lurk within our souls",
            "I have great faith in fools my friends call it self-confidence"
        ],
        specialAttack: {
            threshold: 0.3,
            message: "Letters swapped!",
            triggered: false
        }
    }
]; 

let practiceTexts = [
    "The quick brown fox jumps over the lazy dog",
    "I've met blue lips So true they make you cold inside",
    "The waves suck you in and you drown If like, you should sink down beneath",
    "Funnybunny123 is the best Minecraft username",
    "Hypixel Bridge is a million times better then Bedwars",
    "In the middle of difficulty lies opportunity",
    "The only way to do great work is to love what you do or be Hea1io",
    "How could my day be bad when im with you?",
    "The best time to plant a tree was twenty yers ago, the second best time is now!",
    "It does not matter how slowly you go as long as you do not stop"
];
let practiceText = '';
let practiceCharIndex = 0;
let practiceMistakes = 0;
let practiceTotalChars = 0;
let practiceStartTime = null;
let practiceTimerInterval = null;
let practiceIsFinished = false;
let practiceTextIndex = 0;
let practiceCompleted = 0;
let practiceTotalCorrect = 0;
let practiceTotalTyped = 0;
let practiceMaxCombo = 0;
let practiceCombo = 0;
let practiceModeActive = false;

let currentText = '';
let charIndex = 0;
let mistakes = 0;
let totalChars = 0;
let startTime = null;
let timerInterval = null;
let isFinished = false;
let scrambledTimeout = null;
let originalTextBackup = '';


let currentBossIndex = 0;
let currentQuoteIndex = 0;
let bossHP = bosses[0].hp;
let maxBossHP = bosses[0].maxHp;
let bossDefeated = false;
let gameWon = false;
let allBossesDefeated = false;

let combo = 0;
let maxCombo = 0;
let totalCorrect = 0;
let totalTyped = 0;
let bossDefeatedThisSession = false;

let totalWPM = 0;
let totalAccuracy = 100;
let totalTime = 0;

let currentMode = 'boss';

let selectedQuotes = [];


const textDisplay = document.getElementById('textDisplay');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');

const resetBtn = document.getElementById('resetBtn');
const hint = document.getElementById('hint');

const bossNameEl = document.getElementById('bossName');
const bossHpText = document.getElementById('bossHpText');
const bossHealthFill = document.getElementById('bossHealth');
const bossDefeatedModal = document.getElementById('bossDefeatedModal');

const practiceTextDisplay = document.getElementById('practiceTextDisplay');
const practiceWpmDisplay = document.getElementById('practiceWpm');
const practiceAccuracyDisplay = document.getElementById('practiceAccuracy');
const practiceTimerDisplay = document.getElementById('practiceTimer');
const practiceHint = document.getElementById('practiceHint');

const practiceResetBtn = document.getElementById('practiceResetBtn');
const practiceShareBtn = document.getElementById('practiceShareBtn');
const practiceProgress = document.getElementById('practiceProgress');

const practiceCompleteModal = document.getElementById('practiceCompleteModal');
const practiceModalWpm = document.getElementById('practiceModalWpm');
const practiceModalAccuracy = document.getElementById('practiceModalAccuracy');
const practiceModalTime = document.getElementById('practiceModalTime');
const practiceModalShareBtn = document.getElementById('practiceModalShareBtn');
const practiceModalRedoBtn = document.getElementById('practiceModalRedoBtn');
const practiceModalTexts = document.getElementById('practiceModalTexts');

const modalBossName = document.getElementById('modalBossName');
const modalWpm = document.getElementById('modalWpm');
const modalAccuracy = document.getElementById('modalAccuracy');
const modalTime = document.getElementById('modalTime');
const modalQuotes = document.getElementById('modalQuotes');
const modalShareBtn = document.getElementById('modalShareBtn');
const modalNextBtn = document.getElementById('modalNextBtn');
const modalRedoBtn = document.getElementById('modalRedoBtn');

const bossPortrait = document.getElementById('bossPortrait');
const bossImage = document.getElementById('bossImage');
const bossFallback = document.getElementById('bossFallback');

const comboDisplay = document.getElementById('comboDisplay');

const modeToggleBtn = document.getElementById('modeToggleBtn');
const bossMode = document.getElementById('bossMode');
const practiceMode = document.getElementById('practiceMode');

const shareBtn = document.getElementById('shareBtn');



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function pickRandomQuotes(quotes, count = 5) {
    const shuffled = shuffleArray([...quotes]);
    return shuffled.slice(0,count);
}

function loadBoss(index) {

    if (index >= bosses.length) {
        allBossesDefeated = true ;
        bossNameEl.textContent = 'ALL BOSSES DEFEATED!',
        bossHpText.textContent = 'You are the Typing Master!';
        bossHealthFill.style.width = '0%';
        hint.textContent = 'You beat every boss! Click "New Fight" to start over';

        hint.classList.remove('hidden');
        isFinished = true;
        return;
    }

    if (scrambledTimeout) {
        clearTimeout(scrambledTimeout);
        scrambledTimeout = null;
        originalTextBackup = '';
    }
    const boss = bosses[index];
    bossNameEl.textContent = boss.name;
    updateBossPortrait(boss.image, boss.icon);
    bossHP = boss.hp;
    maxBossHP = boss.maxHp;
    bossDefeated = false;
    boss.specialAttack.triggered = false;
    gameWon = false;

    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    isFinished = false;
    startTime = Date.now();
    clearInterval(timerInterval);

    timerDisplay.textContent = '0';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    textDisplay.style.borderColor = '#2a2a4a';
    hint.classList.remove('hidden');
    hint.textContent = 'Click to start typing';
    document.querySelector('.boss-section').classList.remove('boss-defeated');

    selectedQuotes = pickRandomQuotes(boss.quotes, 5);
    currentQuoteIndex = 0;

    timerInterval = setInterval(() => {
        if (startTime) {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            timerDisplay.textContent = seconds;
            updateStats();
        }
    }, 500);

    loadQuote();
    updateBossHealth();
    textDisplay.focus();

}

function loadQuote() {

    if (scrambledTimeout) {
        clearTimeout(scrambledTimeout);
        scrambledTimeout = null;
        originalTextBackup = '';
    }
    const boss = bosses[currentBossIndex];
    if (currentQuoteIndex >= selectedQuotes.length) {
     if (!bossDefeated) {
        bossDefeated = true;
        gameWon = false;
        document.querySelector('.boss-section').classList.add('boss-defeated');
        bossNameEl.textContent = boss.name + ' SURVIVED!';
        hint.textContent = 'You ran out of quotes! The boss survived! Click "New Fight" to try again';
        hint.classList.remove('hidden');
        isFinished = true;
     }
     return;
    }

    currentText = selectedQuotes[currentQuoteIndex];
    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    isFinished = false;

  
    textDisplay.style.borderColor = '#2a2a4a';
    hint.classList.remove('hidden');
    hint.textContent = `QUOTE ${currentQuoteIndex + 1}/${selectedQuotes.length}`;
    renderText(); 
    }

function loadPracticeText() {
    if (practiceTextIndex >= practiceTexts.length) {
        practiceIsFinished = true;
        practiceComplete();
        return;
    }

    practiceText = practiceTexts[practiceTextIndex];
    practiceCharIndex = 0;
    practiceMistakes = 0;
    practiceTotalChars = 0;
    practiceIsFinished = false;
    practiceCombo = 0;
    practiceStartTime = Date.now();
    clearInterval(practiceTimerInterval);

    practiceTimerDisplay.textContent = '0';
    practiceWpmDisplay.textContent = '0';
    practiceAccuracyDisplay.textContent = '100';
    practiceHint.classList.remove('hidden');
    practiceHint.textContent = `Text ${practiceTextIndex + 1}/${practiceTexts.length}`;
    practiceProgress.textContent = `${practiceTextIndex + 1}/${practiceTexts.length}`;

    renderPracticeText();

    practiceTimerInterval = setInterval(() => {
        if (practiceStartTime) {
            const seconds = Math.floor((Date.now() - practiceStartTime) / 1000);

            practiceTimerDisplay.textContent = seconds;
            updatePracticeStats();
        }
    }, 500);
    practiceTextDisplay.focus();
}

function renderPracticeText() {
    practiceTextDisplay.innerHTML = '';
    for (let i = 0; i < practiceText.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = practiceText[i];
        if (i === 0) span.classList.add('current');
        practiceTextDisplay.appendChild(span);
    }
}

function updatePracticeStats() {
    if(!practiceStartTime) return;

    const elapsed = (Date.now() - practiceStartTime) / 1000 / 60;
    const typedChars = practiceTotalCorrect;
    const wpm = elapsed > 0 ? Math.round((typedChars / 5) / elapsed) : 0;
    const accuracy = practiceTotalTyped > 0 ? Math.round((practiceTotalCorrect / practiceTotalTyped) * 100) : 100;

    practiceWpmDisplay.textContent = wpm;
    practiceAccuracyDisplay.textContent = accuracy;

}

function practiceComplete() {
    clearInterval(practiceTimerInterval);
    practiceIsFinished = true;

    const wpm = practiceWpmDisplay.textContent || '0';
    const accuracy = practiceAccuracyDisplay.textContent || '100';
    const time = practiceTimerDisplay.textContent || '0';

    practiceModalWpm.textContent = wpm;
    practiceModalAccuracy.textContent = accuracy + '%';
    practiceModalTime.textContent = time + 's';
    practiceModalTexts.textContent = `${practiceTexts.length}/${practiceTexts.length}`;

    practiceCompleteModal.classList.remove('hidden');
}

function sharePracticeScore() {
    const wpm = practiceWpmDisplay.textContent;
    const accuracy = practiceAccuracyDisplay.textContent;
    const time = practiceTimerDisplay.textContent;
    const shareText = `PRACTICE MODE\n\nTexts: ${practiceTexts.length}\nWPM: ${wpm}\nAccuracy: ${accuracy}%\n Time: ${time}s\n Max Combo: ${practiceMaxCombo}\n\nCan you beat my practice score?`;
    if (navigator.share) {
        navigator.share({
            title: 'Typing Battles Practice Score',
            text: shareText,
        }).catch(() => {
            prompt('Copy this to share:', shareText);
        });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                practiceHint.textContent = 'Copied to clipboard!';
                practiceHint.className = 'hint restored';
                practiceHint.classList.remove('hidden');
                setTimeout(() => {
                    practiceHint.textContent = 'Click to start practice';
                }, 2000);
            }).catch(() => {
                prompt('Copy to share:', shareText);
            });
        }
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
    const typedChars = totalCorrect;
    const wpm = elapsed > 0 ? Math.round((typedChars / 5) / elapsed) : 0;
    const accuracy = totalTyped > 0  ? Math.round((totalCorrect / totalTyped) * 100) : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;

    if (comboDisplay) {
        comboDisplay.textContent = combo;
    }
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
    animateBossDamage();

    if (bossHP <= 0 && !bossDefeated) {
        bossDefeated = true;
        gameWon = true;
        animateBossDefeated();
        document.querySelector('.boss-section').classList.add('boss-defeated');
        bossNameEl.textContent = 'WIN ' + bosses[currentBossIndex].name + ' DEFEATED!';
        hint.textContent = 'Boss down! Moving to next quote...';
        hint.classList.remove('hidden');
        isFinished = true;

        totalWPM = parseInt(wpmDisplay.textContent) || 0;
        totalAccuracy = parseInt(accuracyDisplay.textContent) || 100;
        totalTime = parseInt(timerDisplay.textContent) || 0;

        setTimeout(function()  {
            updateStats();
            showBossDefeatedModal();
        }, 500);
        
    }
}

function healBoss(amount) {
    bossHP = Math.min(maxBossHP, bossHP + amount);
    updateBossHealth();
    showHealNumber(amount);
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

function showHealNumber(amount) {
    const el = document.createElement('div');
    el.className = 'damage-number heal';
    el.textContent = `+${amount}`;
    const bossSection = document.querySelector('.boss-section');
    const rect = bossSection.getBoundingClientRect();
    el.style.left = (rect.left + rect.width /2 - 20) + 'px';
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

        animateBossSpecialAttack();

        showBossMessage(boss.specialAttack.message + ' 3 seconds!');

        const flash = document.createElement('div');
        flash.className = 'boss-attack-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

        scrambleRemainingText();
    } 
}

function scrambleRemainingText() {
    if (scrambledTimeout) {
        clearTimeout(scrambledTimeout);
        scrambledTimeout = null;
        restoreScrambledText();
    }

    const charSpans = textDisplay.querySelectorAll('.char');
    originalTextBackup = '';
    charSpans.forEach(span => {
        originalTextBackup += span.textContent;
    });

    const remainingChars = [];
    charSpans.forEach((span, i) => {
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

    hint.textContent = 'Text Scrambled! It will restore in 3 seconds...';
    hint.className = 'hint warning';
    hint.classList.remove('hidden');

    scrambledTimeout = setTimeout(() => {
        restoreScrambledText();
    }, 3000);
 }

 function restoreScrambledText() {
    if (!originalTextBackup) return;

    const charSpans = textDisplay.querySelectorAll('.char');
    charSpans.forEach((span, i) => {
        if (i >= charIndex && !span.classList.contains('correct')) {
            span.textContent = originalTextBackup[i] || span.textContent;
        }
    });

    scrambledTimeout = null;
    originalTextBackup = '';

    if (!isFinished && !bossDefeated) {
        hint.textContent = 'Text Restored, keep typing!';
        hint.className = 'hint restored';
        hint.classList.remove('hidden');
        setTimeout(() => {
            if (!isFinished && !bossDefeated) {
                hint.classList.add('hidden');
            }
        }, 1500);
    }
 }


function shareScore() {
    const wpm = wpmDisplay.textContent;
    const accuracy = accuracyDisplay.textContent;
    const bossName = bosses[currentBossIndex].name;
    const status = gameWon ? 'DEFEATED' : 'IN PROGRESS';
    const shareText = `Typing Battles\n\nBoss: ${bossName}\nWPM: ${wpm}\nAccuracy: ${accuracy}%\n Max Combo: ${maxCombo}\nStatus: ${status}\n\nCan you beat my score?`
    
    if (navigator.share) {
        navigator.share({
            title: 'Typing Battles Score',
            text: shareText,
        }).catch(() => {
            prompt('Copy this to share:', shareText);

        
        });
    }
}

function showBossDefeatedModal() {

    updateStats();
    
    const wpm = totalWPM || wpmDisplay.textContent || '0'; 
    const accuracy = totalAccuracy || accuracyDisplay.textContent || '100';
    const time = totalTime || timerDisplay.textContent || '0';

    const boss = bosses[currentBossIndex];
    modalBossName.textContent = boss.name;
    modalWpm.textContent = wpm;
    modalAccuracy.textContent = accuracy + '%'
    modalTime.textContent = time + 's';
    modalQuotes.textContent = `${currentQuoteIndex}/${selectedQuotes.length}`;

    bossDefeatedModal.classList.remove('hidden');

    if (currentBossIndex >= bosses.length - 1) {
        modalNextBtn.textContent = 'All Bosses Defeated!';
        modalNextBtn.disabled = true;
        modalNextBtn.style.opacity = '0.5';
    } else {
        modalNextBtn.textContent = `Next: ${bosses[currentBossIndex + 1].name}`;
        modalNextBtn.disabled = false;
        modalNextBtn.style.opacity = '1';
    }
}

function hideBossDefeatedModal() {
    bossDefeatedModal.classList.add('hidden');
}

modalShareBtn.addEventListener('click', function() {
    shareScore();
});

function animateBossDamage() {
    bossPortrait.classList.remove('damaged');
    void bossPortrait.offsetWidth;
    bossPortrait.classList.add('damaged');
    setTimeout(() => {
        bossPortrait.classList.remove('damaged');
    }, 400);
    
}

function animateBossSpecialAttack() {
    bossPortrait.classList.remove('special-attack');
    void bossPortrait.offsetWidth;
    bossPortrait.classList.add('special-attack');
    setTimeout(() => {
        bossPortrait.classList.remove('special-attack');
    }, 800);
}

function animateBossDefeated() {
    bossPortrait.classList.remove('defeated');
    void bossPortrait.offsetWidth;
    bossPortrait.classList.add('defeated');
}

function updateBossPortrait(imagePath, icon) {
    if (imagePath && imagePath !== '') {
    bossImage.classList.remove('hidden');
    bossImage.src = imagePath;
    bossImage.alt = `Portrait of ${bosses[currentBossIndex].name}`;
    bossFallback.textContent = icon;
    
    bossImage.onerror = function() {
        console.warn(`Failed to load image: ${imagePath}`);
        bossImage.classList.add('hidden');
    };

    bossImage.onload = function() {
        bossImage.classList.remove('hidden');
    };
} else {
   bossImage.classList.add('hidden');
   bossFallback.textContent = icon;
    }
  
}

function toggleMode() {
    if (currentMode === 'boss') {
        currentMode = 'practice';
        bossMode.classList.add('hidden');
        practiceMode.classList.remove('hidden');
        modeToggleBtn.textContent = 'Boss';
        modeToggleBtn.style.borderColor = '#ff3b3b';
        if (practiceTextIndex === 0 && !practiceIsFinished) {
            loadPracticeText();
        }
        practiceTextDisplay.focus();
    } else {
        currentMode = 'boss';
        practiceMode.classList.add('hidden');
        bossMode.classList.remove('hidden');
        modeToggleBtn.textContent = 'Practice';
        modeToggleBtn.style.borderColor = '#4ecdc4';
        textDisplay.focus();
    }

}

modeToggleBtn.addEventListener('click', toggleMode);
    

modalNextBtn.addEventListener('click', function() {
    hideBossDefeatedModal();
    if (currentBossIndex < bosses.length - 1) {
        currentBossIndex++;
        currentQuoteIndex = 0;
        loadBoss(currentBossIndex);
    }
});

modalRedoBtn.addEventListener('click', function() {
    hideBossDefeatedModal();
    bosses[currentBossIndex].specialAttack.triggered = false;
    currentQuoteIndex = 0;
    loadBoss(currentBossIndex);
});

textDisplay.addEventListener('keydown', function(e) {

    if (isFinished || bossDefeated) return;
    if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    if (!startTime) {
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
        totalCorrect++;
        totalTyped++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        const comboBonus = Math.floor(combo / 10);

        const wpm = parseInt(wpmDisplay.textContent) || 0;
        let damage = 1 + comboBonus;
        if (wpm > 60) damage = 3 + comboBonus;
        else if (wpm > 40) damage = 2 + comboBonus;
        else if (wpm > 20) damage = 1.5 + comboBonus;
        else damage = 1 + comboBonus;

        damageBoss(Math.round(damage));

        triggerSpecialAttack();

        if (combo > 0 && combo % 10 === 0) {
            hint.textContent = `${combo} COMBO! +${comboBonus} DAMAGE BONUS!`

            hint.className = 'hint combo';
            hint.classList.remove('hidden');
            setTimeout(() => {
                if (!isFinished) hint.classList.add('hidden');


            }, 1000);
      }

    
    } else {
        currentSpan.classList.add('incorrect');
        mistakes++;
        totalChars++;
        totalTyped++;
        combo = 0;

        healBoss(2);

        textDisplay.style.borderColor = "#ff6b6b66";
        setTimeout(() => {
            if (!isFinished) textDisplay.style.borderColor = '#2a2a4a';
        }, 150);
    }

    if (charIndex < charSpans.length) {
        charSpans[charIndex].classList.add('current');
    }

    updateStats();

    if (charIndex >= currentText.length && !bossDefeated && !allBossesDefeated) {
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

practiceTextDisplay.addEventListener('keydown', function(e) {
    if (practiceIsFinished) return;
    if (e.key.length > 1 || e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    if(!practiceStartTime) {
        practiceStartTime = Date.now();
        practiceHint.classList.add('hidden');
    }

    if (practiceCharIndex >= practiceText.length) {
        return;
    }

    const typedChar = e.key;
    const expectedChar = practiceText[practiceCharIndex];

    const charSpans = practiceTextDisplay.querySelectorAll('.char');
    const currentSpan = charSpans[practiceCharIndex];
    
    charSpans.forEach(span => span.classList.remove('current'));

    if (typedChar === expectedChar) {
        currentSpan.classList.add('correct');
        currentSpan.classList.remove('incorrect');
        practiceCharIndex++;
        practiceTotalCorrect++;
        practiceTotalTyped++;
        practiceCombo++;
        if (practiceCombo > practiceMaxCombo) practiceMaxCombo = practiceCombo;
    } else {
        currentSpan.classList.add('incorrect');
        practiceMistakes++;
        practiceTotalTyped++;
        practiceCombo = 0;

        practiceTextDisplay.style.borderColor = '#ff6b6b66';
        setTimeout(() => {
            if (!practiceIsFinished) practiceTextDisplay.style.borderColor = '#2a2a4a';
        }, 150);
        }

        if (practiceCharIndex < charSpans.length) {
            charSpans[practiceCharIndex].classList.add('current');
        }

        updatePracticeStats();

        if (practiceCharIndex >= practiceText.length) {
            practiceIsFinished = true;
            practiceTextIndex++;
            setTimeout(() => {
                loadPracticeText();

            }, 800);
        }
    });

    practiceTextDisplay.addEventListener('click', function() {
        practiceTextDisplay.focus();
    });

    practiceResetBtn.addEventListener('click', function() {
        practiceTextIndex = 0;
        practiceTotalCorrect = 0;
        practiceTotalTyped = 0;
        practiceMaxCombo = 0;
        practiceCombo = 0;
        practiceCompleteModal.classList.add('hidden');
        loadPracticeText();
        practiceTextDisplay.focus();
    });

    practiceShareBtn.addEventListener('click', function() {
        if (practiceIsFinished) {
            sharePracticeScore();
        } else {
            practiceHint.textContent = 'Finish Practice First!';
            practiceHint.className = 'hint warning';
            practiceHint.classList.remove('hidden');
            setTimeout(() => {
                if (!practiceIsFinished) practiceHint.classList.add('hidden');

            }, 2000);
        }
    });

practiceModalShareBtn.addEventListener('click', function() {
    sharePracticeScore();
});

practiceModalRedoBtn.addEventListener('click', function() {
    practiceCompleteModal.classList.add('hidden');
    practiceTextIndex = 0;
    practiceTotalCorrect = 0;
    practiceTotalTyped = 0;
    practiceMaxCombo = 0;
    practiceCombo = 0;
    loadPracticeText();
    practiceTextDisplay.focus();
});
    



resetBtn.addEventListener('click', function() {
       hideBossDefeatedModal();
       currentQuoteIndex = 0;
       currentBossIndex = 0;
       bosses.forEach(b => b.specialAttack.triggered = false);
       loadBoss(0);
       textDisplay.focus();
    });

shareBtn.addEventListener('click', function() {
    if (bossDefeatedThisSession || allBossesDefeated) {
        shareScore();
    
    } else {
        hint.textContent = 'Defeat The Boss First!';
        hint.className = 'hint warning';
        hint.classList.remove('hidden');
        setTimeout(() => {
            if (!isFinished) hint.classList.add('hidden');
        }, 2000);
    }
});

window.addEventListener('load', function() {
    textDisplay.focus();

});

loadBoss(0);

console.log('Type to defeat the boss!')


