'use strict';

function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function select(selector, parent = document) {
    return parent.querySelector(selector);
}

function getElement(selector, parent = document) {
    return parent.getElementById(selector);
}

// DOM Elements
const userInput = select('.user-input');
const output = select('.output');
const infoOutput = select('.info-output');
const formContainer = select('.form-container');
const containerIntroGame = select('.container-intro-game');
const containerInitialCountdown = select('.container-initial-countdown');
const containerStartGame = select('.container-start-game');
const containerGameOver = select('.container-game-over');
const startBtn = select('.start-btn');
const initialCounter = select('.initial-counter');
const initialCounterH1 = select('.initial-counter-h1');
const gameCountdown = select('.game-countdown');
const restartBtn = select('.restart-btn');
const scoreBtn = select('.score-btn');

// Words array
const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

// Score History
let scoreHistory = [];

// Function to create a score object
function createScore(date, hits, percentage) {
    return {
        date: date,
        hits: hits,
        percentage: percentage
    };
}

// Function to get score history from localStorage
function getScoreHistoryFromLocalStorage() {
    const storedScoreHistory = localStorage.getItem('scoreHistory');
    return storedScoreHistory ? JSON.parse(storedScoreHistory) : [];
}

// Function to save score history to localStorage
function saveScoreHistoryToLocalStorage(scoreHistory) {
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
}

scoreHistory = getScoreHistoryFromLocalStorage();

// Intro Game
function playGame() {
    const introGameAudio = select('.intro-game-audio');
    const gameAudio = select('.game-audio');

    // Pause the game audio if playing
    if (!gameAudio.paused) {
        gameAudio.pause();
        gameAudio.currentTime = 0;
    }

    // Restart the intro audio
    introGameAudio.play();

    containerIntroGame.style.display = 'none';
    containerInitialCountdown.style.display = 'block';
    initialCountdown();
}

onEvent('click', startBtn, playGame);

// Initial Countdown
let initialCountdownInterval = null;

function initialCountdown() {
    let countdown = 5;
    initialCountdownInterval = setInterval(() => {
        initialCounterH1.style.display = 'none';
        initialCounter.textContent = `${countdown}`;

        if (countdown === 0) {
            clearInterval(initialCountdownInterval);
            containerIntroGame.style.display = 'none';
            containerInitialCountdown.style.display = 'none';
            containerStartGame.style.display = 'block';
            startGame();
        }

        countdown--;
    }, 1000);
}

// Start Game
function getRandomWord(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function removeRandomWord(array) {
    let randomIndex = getRandomWord(array);
    array.splice(randomIndex, 1);
}

function displayRandomWord() {
    const wordToDisplay = getRandomWord(words);
    output.textContent = wordToDisplay;
    return wordToDisplay;
}

function compareWords(userInputValue, wordToGuess) {
    const isCorrect = userInputValue.toLowerCase() === wordToGuess.toLowerCase();

    if (isCorrect) {
        const indexToRemove = words.findIndex(word => word.toLowerCase() === wordToGuess.toLowerCase());
        if (indexToRemove !== -1) {
            words.splice(indexToRemove, 1);
        }

        userInput.value = '';
        return true;
    } else {
        return false;
    }
}

let countdownInterval = null;

function startGame() {
    userInput.style.display = 'block';
    userInput.focus();
    userInput.value = '';

    let wordToGuess = displayRandomWord();
    let correctWordCount = 0;

    if (containerStartGame.style.display === 'block') {
        const introGameAudio = select('.intro-game-audio');
        introGameAudio.pause();
        introGameAudio.currentTime = 0;
        const GameAudio = select('.game-audio');
        GameAudio.play();
        let countdown = 25;
        countdownInterval = setInterval(() => {
            if (countdown > 0) {
                countdown--;
                gameCountdown.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${countdown}`;
            }

            if (countdown === 0) {
                output.textContent = 'Game Over';
                userInput.style.display = 'none';
                scoreBtn.style.display = 'inline';
                displayGameOver(correctWordCount);
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    onEvent('input', userInput, () => {
        const userInputValue = userInput.value.trim();
        const isCorrect = compareWords(userInputValue, wordToGuess);

        if (isCorrect) {
            correctWordCount++;

            if (words.length > 0) {
                wordToGuess = displayRandomWord();
            } else {
                output.textContent = 'WOW!!! You cleared the game! Your are an amazing typer';
                displayGameOver(correctWordCount);
                userInput.disabled = true;
                clearInterval(countdownInterval);
            }
        }
    });
}

const originalWords = [...words];

// Restart Game
function restartGame() {
    const introGameAudio = select('.intro-game-audio');
    const gameAudio = select('.game-audio');

    if (!gameAudio.paused) {
        gameAudio.pause();
        gameAudio.currentTime = 0;
    }

    introGameAudio.play();

    words.length = 0;
    words.push(...originalWords);
    userInput.disabled = false;
    userInput.value = '';
    output.textContent = '';
    infoOutput.textContent = '';
    containerStartGame.style.display = 'none';
    scoreBtn.style.display = 'none';
    clearInterval(initialCountdownInterval);
    clearInterval(countdownInterval);
    containerInitialCountdown.style.display = 'block';

    initialCountdown();
}

onEvent('click', restartBtn, restartGame);

// Display info
function displayGameOver(correctWordCount) {
    const date = new Date();
    const hits = correctWordCount;
    const totalWords = originalWords.length;
    const percentage = (correctWordCount / totalWords) * 100;

    // Create a score object using the createScore function
    const gameScore = createScore(
        date.toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
        hits,
        percentage
    );
    scoreHistory.push(gameScore);

    // Update and save the score history to localStorage
    saveScoreHistoryToLocalStorage(scoreHistory);

    // Update modal content
    updateModal();
}

function updateModal() {
    select('.date').innerHTML = '';
    select('.hits').innerHTML = '';
    select('.percentage').innerHTML = '';

    // Sort the score history by hits (descending order).
    const sortedScoreHistory = scoreHistory.slice().sort((a, b) => b.hits - a.hits);

    // Show only the top 10 scores
    const top10Scores = sortedScoreHistory.slice(0, 10);

    // Add score history to the modal
    const scoreTable = select('.score-table');
    scoreTable.innerHTML = '<tr><th>Date</th><th>Words</th><th>Percentage</th></tr>';

    top10Scores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${score.date}</td><td>${score.hits}</td><td>${score.percentage.toFixed(2)}%</td>`;
        scoreTable.appendChild(row);
    });
}

// Modal Elements
const dateElement = select('.date');
const hitsElement = select('.hits');
const percentageElement = select('.percentage');

// Modal
onEvent('DOMContentLoaded', document, function () {
    onEvent('click', scoreBtn, openModal);
});

// Open the modal
function openModal() {
    const modal = getElement('myModal');
    modal.style.display = 'flex';
}

// Close the modal
function closeModal() {
    const modal = getElement('myModal');
    modal.style.display = 'none';
}

// Close the modal if the overlay is clicked
onEvent('click', window, function (event) {
    const modal = getElement('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
