/* =========================
   FOOTER STATUS
========================= */
const footerStatus = document.querySelector('footer p');
function updateFooterStatus() {
    if (countdownInterval || workoutInterval || colorInterval) {
        footerStatus.textContent = "Van aktív időzítő";
    } else {
        footerStatus.textContent = "Nincs aktív időzítő";
    }
}

/* =========================
   VISSZASZÁMLÁLÓ IDŐZÍTŐ
========================= */
let countdownInterval = null;
let countdownTotalSeconds = 0;

const countdownCard = document.querySelector('.cards .card:nth-of-type(1)');
const countdownTimer = countdownCard.querySelector('.timer');
const countdownInputs = countdownCard.querySelectorAll('.inputs input');
const [minutesInput, secondsInput] = countdownInputs;
const countdownButtons = countdownCard.querySelectorAll('.buttons button');
const countdownStatus = countdownCard.querySelector('small');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

countdownButtons[0].addEventListener('click', startCountdown);
countdownButtons[1].addEventListener('click', pauseCountdown);
countdownButtons[2].addEventListener('click', resetCountdown);

function startCountdown() {
    if (countdownInterval) return;

    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    countdownTotalSeconds = minutes * 60 + seconds;
    if (countdownTotalSeconds <= 0) return;

    countdownStatus.textContent = "Visszaszámlálás folyamatban...";
    countdownInterval = setInterval(() => {
        const m = Math.floor(countdownTotalSeconds / 60);
        const s = countdownTotalSeconds % 60;
        countdownTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        countdownTotalSeconds--;
        if (countdownTotalSeconds < 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            countdownStatus.textContent = "Idő lejárt!";
            playCountdownBeep();
        }
        updateFooterStatus();
    }, 1000);

    updateFooterStatus();
}

function pauseCountdown() {
    if (!countdownInterval) return;
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownStatus.textContent = "Visszaszámlálás szüneteltetve";
    updateFooterStatus();
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownTotalSeconds = (parseInt(minutesInput.value) || 0) * 60 + (parseInt(secondsInput.value) || 0);
    const m = Math.floor(countdownTotalSeconds / 60);
    const s = countdownTotalSeconds % 60;
    countdownTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    countdownStatus.textContent = "Készen áll a visszaszámlálásra";
    updateFooterStatus();
}

function playCountdownBeep() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        }, i * 300);
    }
}

/* =========================
   EDZÉS IDŐZÍTŐ
========================= */
let workoutInterval = null;
let currentStepIndex = 0;
let workoutTimeLeft = 30;

const workoutCard = document.querySelector('.cards .card:nth-of-type(2)');
const workoutTimer = workoutCard.querySelector('.timer');
const workoutStatus = workoutCard.querySelector('.status');
const workoutButtons = workoutCard.querySelectorAll('.buttons button');
const workoutSmall = workoutCard.querySelector('small');

let workoutSteps = [
    { name: "Gyakorlat", duration: 30 },
    { name: "Pihenő", duration: 10 }
];

workoutButtons[0].addEventListener('click', startWorkout);
workoutButtons[1].addEventListener('click', pauseWorkout);
workoutButtons[2].addEventListener('click', resetWorkout);

function startWorkout() {
    if (workoutInterval) return;

    workoutStatus.textContent = workoutSteps[currentStepIndex].name;
    workoutSmall.textContent = `Következő: ${workoutSteps[(currentStepIndex + 1) % workoutSteps.length].duration} másodperc ${workoutSteps[(currentStepIndex + 1) % workoutSteps.length].name.toLowerCase()}`;

    workoutInterval = setInterval(() => {
        workoutTimeLeft--;
        if (workoutTimeLeft <= 0) {
            currentStepIndex = (currentStepIndex + 1) % workoutSteps.length;
            workoutTimeLeft = workoutSteps[currentStepIndex].duration;
            workoutStatus.textContent = workoutSteps[currentStepIndex].name;
            workoutSmall.textContent = `Következő: ${workoutSteps[(currentStepIndex + 1) % workoutSteps.length].duration} másodperc ${workoutSteps[(currentStepIndex + 1) % workoutSteps.length].name.toLowerCase()}`;
        }
        workoutTimer.textContent = String(workoutTimeLeft).padStart(2, '0');
        updateFooterStatus();
    }, 1000);

    updateFooterStatus();
}

function pauseWorkout() {
    if (!workoutInterval) return;
    clearInterval(workoutInterval);
    workoutInterval = null;
    workoutStatus.textContent = workoutSteps[currentStepIndex].name + " (szünet)";
    updateFooterStatus();
}

function resetWorkout() {
    clearInterval(workoutInterval);
    workoutInterval = null;
    currentStepIndex = 0;
    workoutTimeLeft = workoutSteps[0].duration;
    workoutTimer.textContent = String(workoutTimeLeft).padStart(2, '0');
    workoutStatus.textContent = "Felkészülés...";
    workoutSmall.textContent = `Következő: ${workoutSteps[1].duration} másodperc pihenő`;
    updateFooterStatus();
}

/* =========================
   SZÍNVÁLTÓ HÁTTÉR
========================= */
let colorInterval = null;
let currentColorIndex = 0;

const colorCard = document.querySelector('.cards .card:nth-of-type(3)');
const colorSpans = colorCard.querySelectorAll('.colors span');
const colorSelect = colorCard.querySelector('select');
const colorButtons = colorCard.querySelectorAll('.buttons button');
const colorSmall = colorCard.querySelector('small');

// Színek listája
let colorArray = Array.from(colorSpans).map(span => span.style.backgroundColor);

// Manuális színválasztás
colorSpans.forEach((span, index) => {
    span.addEventListener('click', () => {
        stopColorChange(); // megállítja az aktuális váltást
        currentColorIndex = index; // a kiválasztott színtől indul az automatikus váltás
        document.body.style.backgroundColor = colorArray[currentColorIndex];
        colorSmall.textContent = `Kiválasztott szín: ${colorArray[currentColorIndex]}`;
        updateFooterStatus();
    });
});

// Automatikus színváltás indítása
colorButtons[0].addEventListener('click', startColorChange);
colorButtons[1].addEventListener('click', stopColorChange);

function startColorChange() {
    if (colorInterval || colorArray.length === 0) return;

    let intervalTime = [1000, 2000, 5000][colorSelect.selectedIndex] || 1000;
    colorSmall.textContent = "Színváltás folyamatban...";

    colorInterval = setInterval(() => {
        document.body.style.backgroundColor = colorArray[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colorArray.length;
        updateFooterStatus();
    }, intervalTime);

    updateFooterStatus();
}

// Automatikus színváltás leállítása
function stopColorChange() {
    clearInterval(colorInterval);
    colorInterval = null;
    colorSmall.textContent = "Színváltás megállítva";
    updateFooterStatus();
}
