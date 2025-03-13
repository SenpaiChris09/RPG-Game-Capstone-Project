// inventory.js
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
        setTimeout(enemyTurn, 2000);
    } else if (item === "Heart of Tarasque") {
        player.hp = Math.min(player.hp + 50, player.maxHp);
        logMessage("Used Heart of Tarasque 💖, restored 50 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000);
    } else if (item === "Minor Potion") {
        player.hp = Math.min(player.hp + 20, player.maxHp);
        logMessage("Used Minor Potion 🧪, restored 20 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000);
    } else if (item === "Major Potion") {
        player.hp = Math.min(player.hp + 50, player.maxHp);
        logMessage("Used Major Potion ⚗️, restored 50 HP!");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);
        setTimeout(enemyTurn, 2000);
    }
    updateStats();
}

function dropLoot() {
    let coinsDropped = Math.floor(Math.random() * 11) + 5;
    if (player.level >= 10 && player.level < 20) {
        coinsDropped += 5;
    } else if (player.level >= 20 && player.level < 30) {
        coinsDropped += 10;
    } else if (player.level >= 30 && player.level < 40) {
        coinsDropped += 15;
    } else if (player.level >= 40 && player.level < 50) {
        coinsDropped += 20;
    } else if (player.level >= 50 && player.level < 60) {
        coinsDropped += 25;
    } else if (player.level >= 60 && player.level < 70) {
        coinsDropped += 30;
    } else if (player.level >= 70 && player.level < 80) {
        coinsDropped += 35;
    } else if (player.level >= 80 && player.level < 90) {
        coinsDropped += 40;
    } else if (player.level >= 90 && player.level < 100) {
        coinsDropped += 45;
    } else if (player.level >= 100) {
        coinsDropped += 50;
    }
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