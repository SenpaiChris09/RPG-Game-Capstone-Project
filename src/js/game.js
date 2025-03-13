// game.js
function resetPlayerStats() {
    player = {
        hp: 100,
        maxHp: 100,
        atk: 10,
        multiplier: 1.0,
        critChance: Math.min(0.02, 1.0),
        blockChance: Math.min(0.02, 1.0),
        level: 1,
        coins: 0,
        inventory: []
    };
    updateStats();
}

function switchScreen(screen) {
    menuScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    shopScreen.style.display = 'none';
    highScoreScreen.style.display = 'none';
    creditsScreen.style.display = 'none';
    screen.style.display = 'block';
    updateStats();
    if (screen === shopScreen) updateShopPrices();
}

function saveGame() {
    localStorage.setItem('savedGame', JSON.stringify(player));
}

function updateHighScore() {
    if (player.level > highScore) {
        highScore = player.level;
        localStorage.setItem('highScore', highScore);
    }
}

// Initial setup (if needed)
document.addEventListener('DOMContentLoaded', () => {
    updateStats(); // Ensure stats are initialized
});