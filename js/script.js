console.log("Game will be loaded")

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
    return scoreBlock;
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

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";

    const btnLeaderboard = document.createElement("button");
    btnLeaderboard.textContent = "Leaderboard";

    gameButtons.append(btnNew, btnDelete, btnLeaderboard)

    app.appendChild(gameButtons);
}

function init() {
    const app = createAppContainer();
    createTitle(app);
    createScore(app);
    createGridContainer(app);
    createButtons(app);
}

init()