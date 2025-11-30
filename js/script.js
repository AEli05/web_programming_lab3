console.log("Game will be loaded")

let board = [];
let cells = [];
let score = 0;
let scoreElement = null;
let previousScore = null;

function createAppContainer() {
    const app = document.createElement("div");
    app.id = 'app';
    document.body.appendChild(app);
    return app;
}

function createTitle(app) {
    const title = document.createElement("h1");
    title.textContent = "2048"
    title.classList.add('game-title');
    app.appendChild(title);
}

function createScore(app) {
    const scoreBlock = document.createElement("div");
    scoreBlock.id = 'score';
    scoreBlock.textContent = "Score: 0";
    app.appendChild(scoreBlock);
    scoreElement = scoreBlock;
    return scoreBlock;
}

function updateScore(newScore) {
    score = newScore;
    if (newScore) {
        scoreElement.textContent = "Score: " + score;
    }
}

function resetScore() {
    updateScore(0);
}

function saveState() {
    previousScore = {
        board: board.map(row => row.slice()),
        score: score
    };
}

function undoScore() {
    if (!previousScore) {
        console.log("No previous state");
        return;
    }

    board = previousScore.board.map(row => row.slice());
    updateScore(previousScore.score);

    createBoard();
}

function createGridContainer(app) {
    const gridContainer = document.createElement("div");
    gridContainer.id = 'grid-container';
    app.appendChild(gridContainer);
    return gridContainer;
}

function createButtons(app) {
    const gameButtons = document.createElement("div");
    gameButtons.id = 'game-buttons';

    const btnNew = document.createElement("button");
    btnNew.textContent = "New Game";

    const btnUndo = document.createElement("button");
    btnUndo.textContent = "Undo";

    const btnLeaderboard = document.createElement("button");
    btnLeaderboard.textContent = "Leaderboard";

    gameButtons.append(btnNew, btnUndo, btnLeaderboard)

    btnNew.addEventListener("click", (e) => {
        startGame();
    })

    btnUndo.addEventListener("click", (e) => {
        undoScore();
    })

    app.appendChild(gameButtons);
}

function createGridCells(gridContainer) {
    cells = [];

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement("div");
        cell.classList.add('game-cell');
        gridContainer.appendChild(cell);
        cells.push(cell);
    }
}

function initBoard() {
    board = [];

    for (let row = 0; row < 4; row++) {
        const rowArray = [];

        for (let col = 0; col < 4; col++) {
            rowArray.push(0);
        }
        board.push(rowArray);
    }
}

function getEmptyCells() {
    const empty = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                empty.push({row, col});
            }
        }
    }
    return empty;
}

function addRandomCell() {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0) {
        return;
    }

    const random = Math.floor(Math.random() * emptyCells.length);
    const cellPos = emptyCells[random];
    const value = Math.random() < 0.9 ? 2 : 4;

    board[cellPos.row][cellPos.col] = value;
}

function createBoard() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const index = row * 4 + col;
            const cell = cells[index];
            const value = board[row][col];

            cell.textContent = value === 0 ? "" : value;
        }
    }
}

function startGame() {
    resetScore();
    initBoard();
    const startCells = Math.floor((Math.random() * 3) + 1);
    for (let i = 0; i < startCells; i++) {
        addRandomCell();
    }

    createBoard();
}

function init() {
    const app = createAppContainer();
    createTitle(app);
    createScore(app);
    const grid = createGridContainer(app);
    createGridCells(grid);
    createButtons(app);
    startGame();
}

init();