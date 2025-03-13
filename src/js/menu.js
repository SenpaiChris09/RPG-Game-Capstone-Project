// menu.js
function startGame() {
    resetPlayerStats();
    switchScreen(gameScreen);
    startCombat();
}

function continueGame() {
    savedGame = JSON.parse(localStorage.getItem('savedGame'));
    if (savedGame) {
        player = savedGame;
        updateStats();
        switchScreen(gameScreen);
        startCombat();
    } else {
        alert("No saved game found!");
    }
}

function showHighScore() {
    document.getElementById('high-score-value').textContent = highScore;
    switchScreen(highScoreScreen);
}

function showCredits() {
    switchScreen(creditsScreen);
    const creditsContent = document.getElementById('credits-content');
    creditsContent.style.bottom = '-100%'; // Reset position
    creditsContent.style.animation = 'none';
    void creditsContent.offsetWidth;
    creditsContent.style.animation = 'rollUp 15s linear forwards';
}

function backToMenu() {
    switchScreen(menuScreen);
    combatLogQueue = [];
    fullCombatHistory = [];
}