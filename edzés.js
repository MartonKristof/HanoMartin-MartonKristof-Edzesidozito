/* =========================
   VISSZASZÁMLÁLÓ IDŐZÍTŐ
========================= */

let countdownInterval = null;

// a HTML első card-jából konkrét inputokat választunk
const countdownCard = document.querySelector('.cards .card:nth-of-type(1)');
const countdownTimer = countdownCard.querySelector('.timer.pink');
const countdownInputs = countdownCard.querySelectorAll('.inputs input');
const countdownMinutesInput = countdownInputs[0];
const countdownSecondsInput = countdownInputs[1];

// gombok
const countdownButtons = countdownCard.querySelectorAll('.buttons button');
countdownButtons[0].addEventListener('click', startCountdown);
countdownButtons[1].addEventListener('click', pauseCountdown);
countdownButtons[2].addEventListener('click', resetCountdown);

function startCountdown() {
    let minutes = parseInt(countdownMinutesInput.value) || 0;
    let seconds = parseInt(countdownSecondsInput.value) || 0;
    let totalSeconds = minutes * 60 + seconds;

    if (totalSeconds <= 0) return;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        countdownTimer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            alert("Visszaszámlálás befejezve!");
        }

        totalSeconds--;
    }, 1000);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownTimer.textContent = "00:00";
}


/* =========================
   EDZÉS IDŐZÍTŐ
========================= */

let workoutInterval = null;
let workoutSteps = [
    { name: "Gyakorlat", duration: 30 },
    { name: "Pihenő", duration: 10 }
];
let currentStepIndex = 0;
let timeLeft = workoutSteps[0].duration;

// Második card
const workoutCard = document.querySelector('.cards .card:nth-child(2)');
const workoutTimer = workoutCard.querySelector('.timer.pink');
const workoutButtons = workoutCard.querySelectorAll('.buttons button');

workoutButtons[0].addEventListener('click', startWorkout);
workoutButtons[1].addEventListener('click', pauseWorkout);
workoutButtons[2].addEventListener('click', resetWorkout);

function startWorkout() {
    clearInterval(workoutInterval);
    currentStepIndex = 0;
    timeLeft = workoutSteps[currentStepIndex].duration;
    updateWorkoutDisplay();

    workoutInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            currentStepIndex = (currentStepIndex + 1) % workoutSteps.length;
            timeLeft = workoutSteps[currentStepIndex].duration;
        }
        updateWorkoutDisplay();
    }, 1000);
}

function updateWorkoutDisplay() {
    workoutTimer.textContent = `${workoutSteps[currentStepIndex].name}: ${timeLeft}s`;
}

function pauseWorkout() {
    clearInterval(workoutInterval);
}

function resetWorkout() {
    clearInterval(workoutInterval);
    workoutTimer.textContent = "Gyakorlat: 30s";
}


/* =========================
   SZÍNVÁLTÓ HÁTTÉR
========================= */

let colorInterval = null;
let currentColorIndex = 0;
const colorCard = document.querySelector('.cards .card:nth-child(3)');
const colorButtons = colorCard.querySelectorAll('.buttons button');
const colors = ['#ff4d6d', '#4d96ff', '#4dff88', '#ffd24d', '#9d4dff'];

// gombok eseménykezelő
colorButtons[0].addEventListener('click', startColorChange);
colorButtons[1].addEventListener('click', stopColorChange);

function startColorChange() {
    clearInterval(colorInterval);
    colorInterval = setInterval(() => {
        document.body.style.backgroundColor = colors[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    }, 3000);
}

function stopColorChange() {
    clearInterval(colorInterval);
}


































