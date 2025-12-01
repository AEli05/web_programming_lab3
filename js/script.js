console.log("Game will be loaded")

let board = [];
let cells = [];
let score = 0;
let scoreElement = null;
let previousScore = null;
let leaderboard = [];

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
    if (scoreElement) {
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

function hasEmptyCells() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                return true;
            }
        }
    }
    return false;
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

function rowsAreEqual(row1, row2) {
    if (row1.length !== row2.length) {return false;}

    for (let i=0; i < row1.length; i++) {
        if (row1[i] !== row2[i]) {return false;}
    }
    return true;
}

function getColumn(colIndex) {
    const column = [];

    for (let row = 0; row < 4; row++) {
        column.push(board[row][colIndex]);
    }

    return column;
}

function setColumn(colIndex, newColumn) {
    for (let row = 0; row < 4; row++) {
        board[row][colIndex] = newColumn[row];
    }
}


function moveRowLeft(row) {
    const compact = row.filter(value => value !== 0);
    let gainedScore = 0;
    for (let i = 0; i < compact.length - 1; i++) {
        if (compact[i] === compact[i + 1]) {
            compact[i] = compact[i] * 2;
            gainedScore += compact[i];
            compact[i + 1] = 0;
        }
    }
    const result = compact.filter(value => value !== 0);
    while (result.length < 4) {
        result.push(0);
    }

    return {
        newRow: result,
        gainedScore: gainedScore
    };
}

function moveRowRight(row) {
    const reversed = row.slice().reverse();

    const { newRow, gainedScore } = moveRowLeft(reversed);

    const restored = newRow.slice().reverse();

    return {
        newRow: restored,
        gainedScore: gainedScore
    };
}

function moveRowDown(column) {

    const reversed = column.slice().reverse();

    const { newRow, gainedScore } = moveRowLeft(reversed);

    const restored = newRow.slice().reverse();

    return {
        newRow: restored,
        gainedScore: gainedScore
    };
}


function moveUp() {
    const stateBefore = {
        board: board.map(row => row.slice()),
        score: score
    };

    let totalGained = 0;
    let moved = false;

    for (let col = 0; col < 4; col++) {
        const currentColumn = getColumn(col);

        const { newRow, gainedScore } = moveRowLeft(currentColumn);

        if (!rowsAreEqual(currentColumn, newRow)) {
            moved = true;
        }

        setColumn(col, newRow);
        totalGained += gainedScore;
    }

    if (moved) {
        previousScore = stateBefore;

        updateScore(score + totalGained);
        addRandomCell();
        createBoard();

        if (isGameOver()) {
            showGameOver();
        }
    }
}

function moveLeft() {
    const stateBefore = {
        board: board.map(row => row.slice()),
        score: score
    };
    let totalGained = 0;
    let moved = false;
    for (let row = 0; row < 4; row++) {
        const currentRow = board[row];

        const { newRow, gainedScore } = moveRowLeft(currentRow);


        if (!rowsAreEqual(currentRow, newRow)) {
            moved = true;
        }

        board[row] = newRow;
        totalGained += gainedScore;
    }

    if (moved) {
        previousScore = stateBefore;

        updateScore(score + totalGained);
        addRandomCell();
        createBoard();

        if (isGameOver()) {
            showGameOver();
        }

    }
}

function moveRight() {
    const stateBefore = {
        board: board.map(row => row.slice()),
        score: score
    };

    let totalGained = 0;
    let moved = false;

    for (let row = 0; row < 4; row++) {
        const currentRow = board[row];

        const { newRow, gainedScore } = moveRowRight(currentRow);

        if (!rowsAreEqual(currentRow, newRow)) {
            moved = true;
        }

        board[row] = newRow;
        totalGained += gainedScore;
    }

    if (moved) {
        previousScore = stateBefore;

        updateScore(score + totalGained);
        addRandomCell();
        createBoard();

        if (isGameOver()) {
            showGameOver();
        }
    }
}

function moveDown() {
    const stateBefore = {
        board: board.map(row => row.slice()),
        score: score
    };

    let totalGained = 0;
    let moved = false;

    for (let col = 0; col < 4; col++) {

        const currentColumn = getColumn(col);

        const { newRow, gainedScore } = moveRowDown(currentColumn);

        if (!rowsAreEqual(currentColumn, newRow)) {
            moved = true;
        }

        setColumn(col, newRow);
        totalGained += gainedScore;
    }

    if (moved) {
        previousScore = stateBefore;

        updateScore(score + totalGained);
        addRandomCell();
        createBoard();

        if (isGameOver()) {
            showGameOver();
        }
    }
}

function canRowMoveLeft(row) {
    const { newRow } = moveRowLeft(row);
    return !rowsAreEqual(row, newRow);
}

function canRowMoveRight(row) {
    const { newRow } = moveRowRight(row);
    return !rowsAreEqual(row, newRow);
}

function canMoveUp() {
    for (let col = 0; col < 4; col++) {
        const currentColumn = getColumn(col);
        const { newRow } = moveRowLeft(currentColumn);

        if (!rowsAreEqual(currentColumn, newRow)) {
            return true;
        }
    }
    return false;
}

function canMoveDown() {
    for (let col = 0; col < 4; col++) {
        const currentColumn = getColumn(col);
        const { newRow } = moveRowDown(currentColumn);

        if (!rowsAreEqual(currentColumn, newRow)) {
            return true;
        }
    }
    return false;
}

function isGameOver() {
    if (hasEmptyCells()) {
        return false;
    }

    for (let row = 0; row < 4; row++) {
        if (canRowMoveLeft(board[row]) || canRowMoveRight(board[row])) {
            return false;
        }
    }

    if (canMoveUp() || canMoveDown()) {
        return false;
    }

    return true;
}

function showGameOver() {
    const modal = document.getElementById("game-over-modal");
    if (modal) {
        modal.classList.remove("hidden");

        const input = document.getElementById("player-name");
        const message = document.getElementById("game-over-message");
        const saveBtn = document.getElementById("save-score-btn");

        if (input) {
            input.value = "";
            input.style.display = "block";
        }
        if (saveBtn) {
            saveBtn.style.display = "inline-block";
        }
        if (message) {
            message.textContent = "Input your name for saving your result:";
        }
    }
}

function hideGameOver() {
    const modal = document.getElementById("game-over-modal");
    if (modal) {
        modal.classList.add("hidden");
    }
}


function createGameOverModal(app) {
    const modal = document.createElement("div");
    modal.id = "game-over-modal";
    modal.classList.add("hidden");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const box = document.createElement("div");
    box.classList.add("game-over-box");

    const title = document.createElement("h2");
    title.textContent = "Game Over";

    const message = document.createElement("p");
    message.textContent = "Input your name for saving your result:";
    message.id = "game-over-message";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Your name";
    input.id = "player-name";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.id = "save-score-btn";

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Start Again";

    box.append(title, message, input, saveBtn, restartBtn);
    modal.append(overlay, box);
    app.appendChild(modal);

    saveBtn.addEventListener("click", () => {
        const name = input.value;
        const ok = saveCurrentResult(name);

        if (ok) {
            message.textContent = "Your result has been saved!";
            input.style.display = "none";
            saveBtn.style.display = "none";
        } else {
            message.textContent = "Please enter your name to save result.";
        }
    });

    restartBtn.addEventListener("click", () => {
        hideGameOver();
        startGame();
    });


    return { modal, saveBtn, input, message };
}

function loadLeaderboard() {
    const data = localStorage.getItem("leaderboard2048");
    if (data) {
        leaderboard = JSON.parse(data);
    } else {
        leaderboard = [];
    }
}

function saveLeaderboard() {
    localStorage.setItem("leaderboard2048", JSON.stringify(leaderboard));
}

function saveCurrentResult(name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return false;
    }

    const record = {
        name: trimmedName,
        score: score,
        date: new Date().toLocaleString()
    };

    leaderboard.push(record);

    leaderboard.sort((a, b) => b.score - a.score);

    leaderboard = leaderboard.slice(0, 10);

    saveLeaderboard();
    return true;
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
    createGameOverModal(app);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            moveLeft();
        } else if (event.key === "ArrowRight") {
            moveRight();
        } else if (event.key === "ArrowUp") {
            moveUp();
        } else if (event.key === "ArrowDown") {
            moveDown();
        }
    });

    startGame();
}

init();