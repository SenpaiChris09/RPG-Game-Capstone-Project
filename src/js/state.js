// state.js
// Player object
let player = {
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

// Game state
let enemy = null;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let savedGame = null;
let combatLogQueue = [];
let fullCombatHistory = [];
let defendCooldown = false;

// DOM elements
const menuScreen = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const shopScreen = document.getElementById('shop');
const highScoreScreen = document.getElementById('high-score');
const creditsScreen = document.getElementById('credits');
const combatLog = document.getElementById('combat-log');
const playerImg = document.getElementById('player-img');
const enemyImg = document.getElementById('enemy-img');
const attackButton = document.querySelector('#actions button[onclick="attack()"]');
const defendButton = document.querySelector('#actions button[onclick="defend()"]');
const combatHistory = document.getElementById('combat-history');
const historyContent = document.getElementById('history-content');
const coinAnimation = document.getElementById('coin-animation');
const playerEffect = document.getElementById('player-effect');
const enemyEffect = document.getElementById('enemy-effect');

// Enemy image array
const enemyImages = [
    "src/img/enemy1.jpg",
    "src/img/enemy2.jpg",
    "src/img/enemy3.jpg",
    "src/img/enemy4.jpg",
    "src/img/enemy5.jpg"
];