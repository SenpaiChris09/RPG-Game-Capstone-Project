// Player object
let player = {
    hp: 100,
    maxHp: 100,
    atk: 10,
    multiplier: 1.0,
    critChance: 0.25,
    blockChance: 0.0, // Base starts at 0, scales with level/items
    level: 1,
    coins: 0,
    inventory: []
};

// Game state
let enemy = null;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let savedGame = null;
let combatLogQueue = []; // Queue for delayed messages
let fullCombatHistory = []; // Store all log entries
let defendCooldown = false; // New flag for defend cooldown

// DOM elements
const menuScreen = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const shopScreen = document.getElementById('shop');
const highScoreScreen = document.getElementById('high-score');
const combatLog = document.getElementById('combat-log');
const playerImg = document.getElementById('player-img');
const enemyImg = document.getElementById('enemy-img');
const attackButton = document.querySelector('#actions button[onclick="attack()"]');
const combatHistory = document.getElementById('combat-history');
const historyContent = document.getElementById('history-content');
const coinAnimation = document.getElementById('coin-animation'); // Added for coin animation
const playerEffect = document.getElementById('player-effect'); // New for GIFs
const enemyEffect = document.getElementById('enemy-effect'); // New for GIFs

// Enemy image array
const enemyImages = [
    "src/img/enemy1.jpg",
    "src/img/enemy2.jpg",
    "src/img/enemy3.jpg",
    "src/img/enemy4.jpg",
    "src/img/enemy5.jpg"
];

// Updated generateEnemy with scaling
function generateEnemy(level) {
    const hpScaling = 50 + 10 * level + Math.floor(level * level * 0.1); // Slower HP growth
    const atkScaling = 5 + Math.floor(level * 1.5); // Reduced ATK growth
    const multiplierScaling = 0.9 + Math.min(0.02 * level, 1.0); // Caps at 1.9x
    return {
        hp: hpScaling,
        atk: atkScaling,
        multiplier: multiplierScaling
    };
}


// Menu Functions
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

function backToMenu() {
    switchScreen(menuScreen);
    combatLogQueue = []; // Clear queue when leaving game
    fullCombatHistory = []; // Clear history
}

// Game Logic
function resetPlayerStats() {
    player = {
        hp: 100,
        maxHp: 100,
        atk: 10, // Base attack
        multiplier: 1.0, // Base damage multiplier
        critChance: 0.25, // Base crit chance
        blockChance: 0.1, // Base block chance
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
    screen.style.display = 'block';
    updateStats();
    if (screen === shopScreen) updateShopPrices(); // Update prices when shop opens
}

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
        updateShopPrices(); // Update price colors
    }
}

function updateShopPrices() {
    const prices = document.querySelectorAll('#shop-table .price');
    prices.forEach(price => {
        const cost = parseInt(price.textContent);
        price.classList.remove('sufficient', 'insufficient');
        price.classList.add(player.coins >= cost ? 'sufficient' : 'insufficient');
    });
}

function startCombat() {
    enemy = generateEnemy(player.level);
    const enemyIndex = (player.level - 1) % enemyImages.length;
    enemyImg.src = enemyImages[enemyIndex];
    attackButton.disabled = false;
    updateStats();
    logMessage(`A level ${player.level} enemy appears!`);
}

function attack() {
    if (!enemy || enemy.hp <= 0) return;

    attackButton.disabled = true;

    let critMultiplier = Math.random() < player.critChance ? 2 : 1;
    let damage = Math.floor(player.atk * player.multiplier * critMultiplier);
    
    if (critMultiplier > 1) {
        logMessage("<b>Critical hit!</b>");
        enemyImg.style.animation = 'vibrate 0.5s linear';
        enemyImg.classList.add('glow-red');
        showEffect(enemyEffect, 'crit'); // Show crit GIF
        setTimeout(() => {
            enemyImg.style.animation = 'moveEnemy 2s alternate';
            enemyImg.classList.remove('glow-red');
            hideEffect(enemyEffect);
        }, 2000);
    }
    if (Math.random() < 0.1) {
        damage = Math.floor(damage / 2);
        logMessage(`<b>Enemy blocked your attack!</b> You deal <b>${damage}</b> damage.`);
        enemyImg.style.animation = 'scaleUp 0.5s linear';
        enemyImg.classList.add('glow-yellow');
        showEffect(enemyEffect, 'block'); // Show block GIF
        setTimeout(() => {
            enemyImg.style.animation = 'moveEnemy 2s alternate';
            enemyImg.classList.remove('glow-yellow');
            hideEffect(enemyEffect);
        }, 3000);
    } else {
        logMessage(`You deal <b>${damage}</b> damage to the enemy!`);
        enemyImg.classList.add('glow-red');
        setTimeout(() => {
            enemyImg.classList.remove('glow-red');
        }, 500);
    }
    enemy.hp -= damage;

    if (enemy.hp <= 0) {
        logMessage("Enemy defeated!");
        dropLoot();
        player.level += 1;
        player.maxHp += 10;
        player.hp = player.maxHp;
        logMessage("Max HP Increased by 10! Healed to full HP.");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);

        // Randomly boost 3 stats
        const statUpgrades = [
            { stat: 'atk', value: 1 + (Math.floor(Math.random() * 3)) , message: "ATK Up! ⚔️" },
            { stat: 'multiplier', value: 0.01 + (Math.floor(Math.random()*100)/1000), message: "Multiplier up! 💎" },
            { stat: 'critChance', value: 0.01 + (Math.floor(Math.random()*100)/1000), message: "Crit Chance up! ⚜️" },
            { stat: 'blockChance', value: 0.01 + (Math.floor(Math.random()*100)/1000), message: "Block Chance up! 🛡️" }
        ];

        // Shuffle and pick 3 random stats
        const shuffledStats = statUpgrades.sort(() => Math.random() - 0.5); // Simple shuffle
        const selectedStats = shuffledStats.slice(0, 3); // Take first 3

        // Apply and log the boosts
        selectedStats.forEach(upgrade => {
            player[upgrade.stat] += upgrade.value;
            logMessage(upgrade.message);
        });

        saveGame();
        setTimeout(startCombat, 2000); // Increased delay to account for messages
    } else {
        setTimeout(enemyTurn, 2000); // Increased delay for message queue
    }
    updateStats();
}

function enemyTurn(dodged = false) {
    const baseDodgeChance = Math.min(0.1 + player.level * 0.002, 0.3); // 10% + 0.2% per level, max 30%
    
    if (dodged) {
        logMessage("Enemy swings but misses completely!");
        setTimeout(() => attackButton.disabled = false, 1000); // Re-enable attack
        updateStats();
        return; // Skip damage calculation
    }

    let enemyDamage = Math.floor(enemy.atk * enemy.multiplier);
    let damageTaken = true;

    // Check dodge first (independent of block)
    if (Math.random() < baseDodgeChance) {
        logMessage("<b>You dodged the enemy's attack!</b> No damage taken!");
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'dodge'); // Show dodge GIF
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-yellow');
            hideEffect(playerEffect);
        }, 2000);
        damageTaken = false;
    }
    // If dodge fails, check block
    else if (Math.random() < player.blockChance) {
        enemyDamage = Math.floor(enemyDamage / 2);
        logMessage(`<b>You blocked the enemy's attack!</b> Enemy deals <i>${enemyDamage}</i> damage.`);
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'block'); // Show block GIF
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-yellow');
            hideEffect(playerEffect);
        }, 3000);
    }
    // Neither dodge nor block
    else {
        logMessage(`Enemy deals <b>${enemyDamage}</b> damage to you!`);
        playerImg.classList.add('glow-red');
        setTimeout(() => {
            playerImg.classList.remove('glow-red');
        }, 500);
    }

    // Apply damage only if neither dodge nor block succeeded
    if (damageTaken) {
        player.hp -= enemyDamage;
    }

    if (player.hp <= 0) {
        logMessage("You have been defeated!");
        updateHighScore();
        setTimeout(backToMenu, 2000);
    } else {
        setTimeout(() => attackButton.disabled = false, 1000); // Delay re-enable
    }
    updateStats();
}

function useItem() {
    if (player.inventory.length === 0) {
        logMessage("No items to use!");
        return;
    }
    const item = player.inventory.pop();

    if (item === "Vitality Shard") {
        player.hp = Math.min(player.hp + 20, player.maxHp);
        logMessage("Used Vitality Shard 💟, restored 20 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000); //Enemy turn after using item
    } else if (item === "Heart of Tarasque") {
        player.hp = Math.min(player.hp + 50, player.maxHp);
        logMessage("Used Heart of Tarasque 💖, restored 50 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000); //Enemy turn after using item
    } else if (item === "Minor Potion") {
        player.hp = Math.min(player.hp + 20, player.maxHp);
        logMessage("Used Minor Potion 🧪, restored 20 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000); //Enemy turn after using item
    } else if (item === "Major Potion") {
        player.hp = Math.min(player.hp + 50, player.maxHp);
        logMessage("Used Major Potion ⚗️, restored 50 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000); //Enemy turn after using item
    }
    updateStats();
}

// Updated defend function with cooldown and scaling
function defend() {
    if (defendCooldown) {
        logMessage("Defend is on cooldown!");
        return;
    }

    const levelScaledDodge = Math.min(0.5 + player.level * 0.005, 0.75); // 50% + 0.5% per level, max 75%
    const bonusBlockChance = Math.min(0.2 + player.level * 0.002, 0.4); // 20% + 0.2% per level, max 40%

    if (Math.random() < levelScaledDodge) {
        logMessage("<b>You dodged the enemy's attack!</b> No damage taken!");
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'dodge'); // Show dodge GIF
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-yellow');
            hideEffect(playerEffect);
        }, 2000);
        setTimeout(enemyTurn, 1000, true);
    } else {
        logMessage(`Dodge failed! <b>Blocking stance activated</b> (+${(bonusBlockChance * 100).toFixed(0)}% block chance).`);
        player.blockChance += bonusBlockChance;
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-green');
        showEffect(playerEffect, 'block'); // Show block GIF
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-green');
            player.blockChance -= bonusBlockChance;
            hideEffect(playerEffect);
        }, 1500);
        setTimeout(enemyTurn, 1000, false);
    }

    // Set cooldown
    defendCooldown = true;
    defendButton.disabled = true;
    defendButton.style.opacity = '0.5'; // Visual feedback
    setTimeout(() => {
        defendCooldown = false;
        defendButton.disabled = false;
        defendButton.style.opacity = '1';
    }, 1000); // 1s cooldown (1 turn)

    updateStats();
}

// New functions for effect visuals
function showEffect(element, type) {
    if (type === 'dodge') {
        element.src = 'src/img/dodge.gif'; // Replace with your dodge GIF
    } else if (type === 'block') {
        element.src = 'src/img/block.gif'; // Replace with your block GIF
    } else if (type === 'crit') {
        element.src = 'src/img/crit.gif'; // Replace with your crit GIF
    }
    element.style.display = 'block';
}

function hideEffect(element) {
    element.style.display = 'none';
}

function dropLoot() {
    const coinsDropped = Math.floor(Math.random() * 11) + 5;
    player.coins += coinsDropped;
    logMessage(`Enemy dropped ${coinsDropped} coins!`);

    const lootTable = [
        "Sword Fragment", "Sword Fragment", "Sword Fragment", "Sword Fragment", "Sword Fragment", "Sword Fragment",
        "Vitality Shard", "Vitality Shard", "Vitality Shard", "Vitality Shard", "Vitality Shard", "Vitality Shard",
        "Divine Rapier", "Divine Rapier",
        "Heart of Tarasque", "Heart of Tarasque",
        "Multiplier Gem", "Multiplier Gem", "Multiplier Gem", "Multiplier Gem", "Multiplier Gem", "Multiplier Gem",
        "Mid Multiplier Gem", "Mid Multiplier Gem",
        "Crit Shard", "Crit Shard", "Crit Shard", "Crit Shard", "Crit Shard", "Crit Shard", 
        "Desolator", "Desolator", 
        "Shield Fragment", "Shield Fragment" ,"Shield Fragment" ,"Shield Fragment" ,"Shield Fragment",
        "Vanguard", "Vanguard"
    ];
    const loot = lootTable[Math.floor(Math.random() * lootTable.length)];

    if (loot === "Sword Fragment") {
        player.atk += 1;
        logMessage("Enemy dropped a Sword Fragment! ⚔️ ATK +1");
    } else if (loot === "Divine Rapier") {
        player.atk += 5;
        logMessage("Enemy dropped a Divine Rapier! ⚔️ ATK +5");
    } else if (loot === "Vitality Shard") {
        player.inventory.push(loot);
        logMessage("Enemy dropped a Vitality Shard! 💟 ");
    } else if (loot === "Heart of Tarasque") {
        player.inventory.push(loot);
        logMessage("Enemy dropped a Heart of Tarasque! 💖");
    } else if (loot === "Multiplier Gem") {
        player.multiplier += 0.01;
        logMessage("Enemy dropped a Multiplier Gem! 💎 Multiplier +0.02x");
    } else if (loot === "Mid Multiplier Gem") {
        player.multiplier += 0.05;
        logMessage("Enemy dropped a Mid Multiplier Gem! ‧₊˚💎✩ ₊˚ Multiplier +0.05x");
    } else if (loot === "Crit Shard") {
        player.critChance += 0.01;
        logMessage(`Enemy dropped a Crit Shard! ⚜️ Crit Chance +1% (Now ${(player.critChance * 100).toFixed(0)}%)`);
    } else if (loot === "Desolator") {
        player.critChance += 0.05;
        logMessage(`Enemy dropped a Desolator! ⚜️ Crit Chance +5% (Now ${(player.critChance * 100).toFixed(0)}%)`);
    } else if (loot === "Shield Fragment") {
        player.blockChance += 0.01;
        logMessage(`Enemy dropped a Shield Fragment! 🛡️ Block Chance +1% (Now ${(player.blockChance * 100).toFixed(0)}%)`);
    } else if (loot === "Vanguard") {
        player.blockChance += 0.05;
        logMessage(`Enemy dropped a Vanguard! 🛡️ Block Chance +5% (Now ${(player.blockChance * 100).toFixed(0)}%)`);
    }
    
    
}

function buyPotion(potionName, cost, healAmount) {
    if (player.coins >= cost) {
        player.coins -= cost;
        player.inventory.push(potionName);
        logMessage(`Bought a ${potionName} for ${cost} coins! 🧪`);
        animateCoinDeduction(cost); // Add coin animation
        updateStats();
    } else {
        logMessage("Not enough coins! 💰");
    }
}

function buyItem(itemName, cost, stat, value) {
    if (player.coins >= cost) {
        player.coins -= cost;
        if (stat === 'atk') {
            player[stat] += value;
            logMessage(`Bought a ${itemName}! ⚔️ ${stat.toUpperCase()} +${value}`);
        } else if (stat === 'critChance' || stat === 'blockChance') {
            player[stat] += value;
            logMessage(`Bought a ${itemName}! ${stat === 'critChance' ? '⚜️ Crit Chance' : '🛡️ Block Chance'} +${(value * 100).toFixed(0)}% (Now ${(player[stat] * 100).toFixed(0)}%)`);
        }
        animateCoinDeduction(cost); // Add coin animation
        updateStats();
    } else {
        logMessage("Not enough coins! 💰");
    }
}

function animateCoinDeduction(cost) {
    const deduction = document.createElement('div');
    deduction.textContent = `-${cost}`;
    deduction.classList.add('coin-deduction');
    coinAnimation.appendChild(deduction);
    setTimeout(() => deduction.remove(), 1000); // Remove after animation (1s)
}

function showInventory() {
    if (player.inventory.length === 0) {
        logMessage("Inventory is empty!");
    } else {
        const itemCount = {};
        player.inventory.forEach(item => {
            itemCount[item] = (itemCount[item] || 0) + 1;
        });
        const inventoryList = Object.entries(itemCount)
            .map(([item, count]) => `${item} x${count}`)
            .join(", ");
        logMessage("Inventory: " + inventoryList);
    }
}

function logMessage(message) {
    combatLogQueue.push(message); // Add to queue
    fullCombatHistory.push(message); // Add to full history
    processLogQueue(); // Process the queue
}

function processLogQueue() {
    if (combatLogQueue.length === 0) return;

    const message = combatLogQueue.shift(); // Get first message
    const logEntry = document.createElement('p');
    logEntry.innerHTML = message; // Use innerHTML to render HTML tags
    combatLog.appendChild(logEntry);

    // Limit to 5 visible entries, fade out older ones
    const entries = combatLog.getElementsByTagName('p');
    if (entries.length > 5) {
        for (let i = 0; i < entries.length - 5; i++) {
            entries[i].classList.add('fade-out');
        }
    }

    combatLog.scrollTop = combatLog.scrollHeight; // Scroll to bottom

    // Delay next message by 500ms
    if (combatLogQueue.length > 0) {
        setTimeout(processLogQueue, 500);
    }
}

function toggleHistory() {
    if (combatHistory.style.display === 'none' || combatHistory.style.display === '') {
        historyContent.innerHTML = fullCombatHistory.map(msg => `<p>${msg}</p>`).join(''); // Render HTML in history too
        combatHistory.style.display = 'block';
    } else {
        combatHistory.style.display = 'none';
    }
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