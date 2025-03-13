// ui.js
function updateStats() {
    document.getElementById('player-hp').textContent = player.hp;
    document.getElementById('player-max-hp').textContent = player.maxHp;
    document.getElementById('player-atk').textContent = player.atk;
    document.getElementById('player-multiplier').textContent = player.multiplier.toFixed(1) + 'x';
    document.getElementById('player-coins').textContent = player.coins;
    document.getElementById('player-level').textContent = player.level;

    const hpElement = document.getElementById('player-hp');
    if (player.hp / player.maxHp < 0.3) {
        hpElement.classList.add('low-hp');
        playerImg.style.animation = 'vibrate 3s linear infinite, glowRed 1s linear infinite';
    } else {
        playerImg.style.animation = 'movePlayer 2s alternate';
        hpElement.classList.remove('low-hp');
    }

    if (enemy) {
        document.getElementById('enemy-hp').textContent = enemy.hp;
        document.getElementById('enemy-atk').textContent = enemy.atk;
        document.getElementById('enemy-multiplier').textContent = enemy.multiplier.toFixed(1) + 'x';
    }
    if (shopScreen.style.display === 'block') {
        document.getElementById('shop-coins').textContent = player.coins;
        updateShopPrices();
    }

    document.getElementById('player-max-hp-info').textContent = player.maxHp;
    document.getElementById('player-atk-info').textContent = player.atk;
    document.getElementById('player-multiplier-info').textContent = player.multiplier.toFixed(3) + 'x';
    document.getElementById('player-crit-info').textContent = (player.critChance * 100).toFixed(1) + '%';
    document.getElementById('player-block-info').textContent = (player.blockChance * 100).toFixed(1) + '%';
    const baseDodgeChance = Math.min(0.018 + player.level * 0.002, 0.3);
    document.getElementById('player-dodge-info').textContent = (baseDodgeChance * 100).toFixed(1) + '%';

    if (enemy) {
        document.getElementById('enemy-max-hp-info').textContent = Math.floor(50 + 5 * player.level + player.level * player.level * 0.1);
        document.getElementById('enemy-atk-info').textContent = enemy.atk;
        document.getElementById('enemy-multiplier-info').textContent = enemy.multiplier.toFixed(3) + 'x';
        document.getElementById('enemy-crit-info').textContent = (enemy.critChance * 100).toFixed(0) + '%';
        document.getElementById('enemy-block-info').textContent = (enemy.blockChance * 100).toFixed(0) + '%';
    }
}

function logMessage(message) {
    combatLogQueue.push(message);
    fullCombatHistory.push(message);
    processLogQueue();
}

function processLogQueue() {
    if (combatLogQueue.length === 0) return;

    const message = combatLogQueue.shift();
    const logEntry = document.createElement('p');
    logEntry.innerHTML = message;
    combatLog.appendChild(logEntry);

    const entries = combatLog.getElementsByTagName('p');
    if (entries.length > 5) {
        for (let i = 0; i < entries.length - 5; i++) {
            entries[i].classList.add('fade-out');
        }
    }

    combatLog.scrollTop = combatLog.scrollHeight;

    if (combatLogQueue.length > 0) {
        setTimeout(processLogQueue, 500);
    }
}

function toggleHistory() {
    if (combatHistory.style.display === 'none' || combatHistory.style.display === '') {
        historyContent.innerHTML = fullCombatHistory.map(msg => `<p>${msg}</p>`).join('');
        combatHistory.style.display = 'block';
    } else {
        combatHistory.style.display = 'none';
    }
}