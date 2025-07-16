// combat.js
function generateEnemy(level) {
    const hpScaling = 75 + 5 * level + Math.floor(level * level * 0.50);
    const atkScaling = 5 + Math.floor(level * 1.5);
    const multiplierScaling = 0.9 + Math.min(0.02 * level, 1.0);
    
    const enemy = {
        hp: hpScaling,
        atk: atkScaling,
        multiplier: multiplierScaling,
        critChance: 0,
        blockChance: 0
    };

    if (level < 10) {
        enemy.critChance = (Math.floor(Math.random() * 5) + 1) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 5) + 1) / 100;
    } else if (level >= 10 && level < 20) {
        enemy.critChance = (Math.floor(Math.random() * 10) + 5) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 10) + 5) / 100;
    } else if (level >= 20 && level < 30) {
        enemy.critChance = (Math.floor(Math.random() * 15) + 10) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 15) + 10) / 100;
    } else if (level >= 30 && level < 40) {
        enemy.critChance = (Math.floor(Math.random() * 20) + 15) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 20) + 15) / 100;
    } else if (level >= 40 && level < 50) {
        enemy.critChance = (Math.floor(Math.random() * 25) + 20) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 25) + 20) / 100;
    } else if (level >= 50) {
        enemy.critChance = (Math.floor(Math.random() * 30) + 25) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 30) + 25) / 100;
    } else if (level >= 60) {
        enemy.critChance = (Math.floor(Math.random() * 35) + 30) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 35) + 30) / 100;
    } else if (level >= 70) {
        enemy.critChance = (Math.floor(Math.random() * 40) + 35) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 40) + 35) / 100;
    } else if (level >= 80) {
        enemy.critChance = (Math.floor(Math.random() * 45) + 4) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 45) + 4) / 100;
    } else if (level >= 90) {
        enemy.critChance = (Math.floor(Math.random() * 50) + 45) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 50) + 45) / 100;
    } else if (level >= 100) {
        enemy.critChance = (Math.floor(Math.random() * 55) + 50) / 100;
        enemy.blockChance = (Math.floor(Math.random() * 55) + 50) / 100;
    }

    return enemy;
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
        showEffect(enemyEffect, 'crit');
        setTimeout(() => {
            enemyImg.style.animation = 'moveEnemy 2s alternate';
            enemyImg.classList.remove('glow-red');
            hideEffect(enemyEffect);
        }, 2000);
    }
    if (Math.random() < enemy.blockChance) {
        damage = Math.floor(damage / 2);
        logMessage(`<b>Enemy blocked your attack!</b> Enemy blocks with ${(enemy.blockChance * 100).toFixed(0)}% chance. Deals <b>${damage}</b> damage.`);
        enemyImg.style.animation = 'scaleUp 0.5s linear';
        enemyImg.classList.add('glow-yellow');
        showEffect(enemyEffect, 'block');
        setTimeout(() => {
            enemyImg.style.animation = 'moveEnemy 2s alternate';
            enemyImg.classList.remove('glow-yellow');
            hideEffect(enemyEffect);
        }, 3000);
    } else {
        logMessage(`You deal <b>${damage}</b> damage to the enemy!`);
        enemyImg.classList.add('glow-red');
        setTimeout(() => enemyImg.classList.remove('glow-red'), 500);
    }
    enemy.hp -= damage;

    if (enemy.hp <= 0) {
        logMessage("Enemy defeated!");
        dropLoot();
        player.level += 1;

        if (player.level < 10) {
            player.maxHp += 10;
        } else if (player.level >= 10 && player.level < 20) {
            player.maxHp += 20;
        } else if (player.level >= 20 && player.level < 30) {
            player.maxHp += 40;
        } else if (player.level >= 30 && player.level < 40) {
            player.maxHp += 60;
        } else if (player.level >= 40 && player.level < 50) {
            player.maxHp += 80;
        } else if (player.level >= 50 && player.level < 60) {
            player.maxHp += 100;
        } else if (player.level >= 60 && player.level < 70) {
            player.maxHp += 120;
        } else if (player.level >= 70 && player.level < 80) {
            player.maxHp += 140;
        } else if (player.level >= 80 && player.level < 90) {
            player.maxHp += 160;
        } else if (player.level >= 90 && player.level < 100) {
            player.maxHp += 180;
        } else if (player.level >= 100) {
            player.maxHp += 200;
        }
        
        player.hp = player.maxHp;
        logMessage("Max HP Increased! Healed to full HP.");
        playerImg.classList.add('glow-green');
        setTimeout(() => playerImg.classList.remove('glow-green'), 500);

        const statUpgrades = [
            { stat: 'atk', value: 1 + Math.floor(Math.random() * 3), message: "ATK Up! ⚔️" },
            { stat: 'multiplier', value: Math.floor(Math.random() * 100) / 1500, message: "Multiplier up! 💎" },
            { stat: 'critChance', value: Math.min(player.level * 0.002, 0.5), message: "Crit Chance up! ⚜️" },
            { stat: 'blockChance', value: Math.min(player.level * 0.002, 0.5), message: "Block Chance up! 🛡️" }
        ];

        const shuffledStats = statUpgrades.sort(() => Math.random() - 0.5);
        const selectedStats = shuffledStats.slice(0, 3);

        selectedStats.forEach(upgrade => {
            player[upgrade.stat] += upgrade.value;
            logMessage(upgrade.message);
        });

        saveGame();
        setTimeout(startCombat, 2000);
    } else {
        setTimeout(enemyTurn, 2000);
    }
    updateStats();
}

function enemyTurn(dodged = false) {
    const baseDodgeChance = Math.min(0.018 + player.level * 0.002, 0.3);
    
    if (dodged) {
        logMessage("Enemy swings but misses completely!");
        setTimeout(() => attackButton.disabled = false, 1000);
        updateStats();
        return;
    }

    let enemyDamage = Math.floor(enemy.atk * enemy.multiplier);
    let critMultiplier = Math.random() < enemy.critChance ? 2 : 1;
    enemyDamage = Math.floor(enemyDamage * critMultiplier);
    let damageTaken = true;

    if (critMultiplier > 1) {
        logMessage(`<b>Enemy lands a critical hit!</b> Crit chance: ${(enemy.critChance * 100).toFixed(0)}%.`);
        playerImg.style.animation = 'vibrate 0.5s linear';
        playerImg.classList.add('glow-red');
        showEffect(playerEffect, 'crit');
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-red');
            hideEffect(playerEffect);
        }, 2000);
    }

    if (Math.random() < baseDodgeChance) {
        logMessage("<b>You dodged the enemy's attack!</b> No damage taken!");
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'dodge');
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-yellow');
            hideEffect(playerEffect);
        }, 2000);
        damageTaken = false;
    } else if (Math.random() < player.blockChance) {
        enemyDamage = Math.floor(enemyDamage / 2);
        logMessage(`<b>You blocked the enemy's attack!</b> Enemy deals <i>${enemyDamage}</i> damage.`);
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'block');
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-yellow');
            hideEffect(playerEffect);
        }, 3000);
    } else {
        logMessage(`Enemy deals <b>${enemyDamage}</b> damage to you!`);
        playerImg.classList.add('glow-red');
        setTimeout(() => playerImg.classList.remove('glow-red'), 500);
    }

    if (damageTaken) {
        player.hp -= enemyDamage;
    }

    if (player.hp <= 0) {
        logMessage("You have been defeated!");
        updateHighScore();
        setTimeout(backToMenu, 2000);
    } else {
        setTimeout(() => attackButton.disabled = false, 1000);
    }
    updateStats();
}

function defend() {
    if (defendCooldown) {
        logMessage("Defend is on cooldown!");
        return;
    }

    const levelScaledDodge = Math.min(0.5 + player.level * 0.005, 0.75);
    const bonusBlockChance = Math.min(0.2 + player.level * 0.002, 0.4);

    if (Math.random() < levelScaledDodge) {
        logMessage("<b>You dodged the enemy's attack!</b> No damage taken!");
        playerImg.style.animation = 'scaleUp 0.5s linear';
        playerImg.classList.add('glow-yellow');
        showEffect(playerEffect, 'dodge');
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
        showEffect(playerEffect, 'block');
        setTimeout(() => {
            playerImg.style.animation = 'movePlayer 2s alternate';
            playerImg.classList.remove('glow-green');
            player.blockChance -= bonusBlockChance;
            hideEffect(playerEffect);
        }, 1500);
        setTimeout(enemyTurn, 1000, false);
    }

    defendCooldown = true;
    defendButton.disabled = true;
    defendButton.style.opacity = '0.5';
    setTimeout(() => {
        defendCooldown = false;
        defendButton.disabled = false;
        defendButton.style.opacity = '1';
    }, 1000);

    updateStats();
}

function showEffect(element, type) {
    if (type === 'dodge') {
        element.src = 'src/img/dodge.gif';
    } else if (type === 'block') {
        element.src = 'src/img/block.gif';
    } else if (type === 'crit') {
        element.src = 'src/img/crit.gif';
    }
    element.style.display = 'block';
}

function hideEffect(element) {
    element.style.display = 'none';
}