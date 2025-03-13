// shop.js
function buyPotion(potionName, cost, healAmount) {
    if (player.coins >= cost) {
        player.coins -= cost;
        player.inventory.push(potionName);
        logMessage(`Bought a ${potionName} for ${cost} coins! 🧪`);
        animateCoinDeduction(cost);
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
        animateCoinDeduction(cost);
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
    setTimeout(() => deduction.remove(), 1000);
}

function updateShopPrices() {
    const prices = document.querySelectorAll('#shop-table .price');
    prices.forEach(price => {
        const cost = parseInt(price.textContent);
        price.classList.remove('sufficient', 'insufficient');
        price.classList.add(player.coins >= cost ? 'sufficient' : 'insufficient');
    });
}