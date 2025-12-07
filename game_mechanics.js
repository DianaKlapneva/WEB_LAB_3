let grid = [];
let score = 0;
let gameStarted = false;
let previousStates = [];

function initGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameStarted = true;
    previousStates = [];
    updateScore();

    addRandomTile();
    addRandomTile();
    renderGrid();
    showMobileControls();

    //надо скрыть game over
    const gameOverContainer = document.getElementById('game-over');
    if (gameOverContainer) {
        gameOverContainer.style.display = 'none';
    }


}

//сохраняем состояния ячеек игры
function saveState() {
    previousStates.push({
        grid: JSON.parse(JSON.stringify(grid)),
        score: score
    });
    if (previousStates.length > 10) {
        previousStates.shift();
    }
}

//можно вернуться на шаг назад
function undoMove() {
    if (!gameStarted || previousStates.length === 0) return;
    
    const previousState = previousStates.pop();
    grid = previousState.grid;
    score = previousState.score;
    updateScore();
    renderGrid();
}




function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderGrid() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            if (grid[i][j] !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${grid[i][j]}`;
                tile.textContent = grid[i][j];
                const tileSize = 25;
                const gap = 2; 
                tile.style.left = `${j * tileSize + gap}%`;
                tile.style.top = `${i * tileSize + gap}%`;
                cell.appendChild(tile);
            }
            
            gridContainer.appendChild(cell);
        }
    }
}

//меняем колво очков
function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

//все по перемещению
function move(direction) {
    if (!gameStarted) {
        return false;
    }
    
    saveState();
    let moved = false;
    
    
    switch(direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        addRandomTile();
        renderGrid();
        updateScore();
        checkGameOver();
    } else {
        //если не было движения, убираем сохраненное состояние
        previousStates.pop();
    }
    
    return moved;
}

function moveLeft() {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
        
        const newRow = [];
        let previous = null;
        let merged = false;
        
        //сначала все сдвигаем влево без слияния
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] !== 0) {
                if (previous === null) {
                    //первая ненулевая плитка
                    newRow.push(grid[i][j]);
                    previous = grid[i][j];
                } else if (!merged && previous === grid[i][j]) {
                    //слияние если две одинаковые плитки рядом
                    newRow[newRow.length - 1] = grid[i][j] * 2;
                    score += grid[i][j] * 2;
                    merged = true;
                    //в этом ходу уже убрали эту плитку
                } else {
                    //разные плитки, значит продолжаем
                    newRow.push(grid[i][j]);
                    previous = grid[i][j];
                    merged = false;
                }
            }
        }
        
        //добавим нули в конец
        while (newRow.length < 4) {
            newRow.push(0);
        }
        
        //было ли движение?
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) {
            moved = true;
            grid[i] = newRow;
        }
    }
    
    return moved;
}

function moveRight() {
let moved = false;
    
    for (let i = 0; i < 4; i++) {
        const newRow = [];
        let previous = null;
        let merged = false;
        
        //сдвиг справа налево
        for (let j = 3; j >= 0; j--) {
            if (grid[i][j] !== 0) {
                if (previous === null) {
                    newRow.unshift(grid[i][j]);
                    previous = grid[i][j];
                } else if (!merged && previous === grid[i][j]) {
                    //слияние справа налево
                    newRow[0] = grid[i][j] * 2;
                    score += grid[i][j] * 2;
                    merged = true;
                } else {
                    newRow.unshift(grid[i][j]);
                    previous = grid[i][j];
                    merged = false;
                }
            }
        }
        
        //нули в начало
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) {
            moved = true;
            grid[i] = newRow;
        }
    }
    
    return moved;
}

function moveUp() {
        let moved = false;
    
    for (let j = 0; j < 4; j++) {
        const newColumn = [];
        let previous = null;
        let merged = false;
        
        //сдвиг и слияние вверх
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) {
                if (previous === null) {
                    newColumn.push(grid[i][j]);
                    previous = grid[i][j];
                } else if (!merged && previous === grid[i][j]) {
                    newColumn[newColumn.length - 1] = grid[i][j] * 2;
                    score += grid[i][j] * 2;
                    merged = true;
                } else {
                    newColumn.push(grid[i][j]);
                    previous = grid[i][j];
                    merged = false;
                }
            }
        }
        
        while (newColumn.length < 4) {
            newColumn.push(0);
        }
        
        //проверка и обновление колонки
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    
    return moved;
}

function moveDown() {
    let moved = false;
    
    for (let j = 0; j < 4; j++) {
        const newColumn = [];
        let previous = null;
        let merged = false;
        
        //сдвиг+слияние вниз
        for (let i = 3; i >= 0; i--) {
            if (grid[i][j] !== 0) {
                if (previous === null) {
                    newColumn.unshift(grid[i][j]);
                    previous = grid[i][j];
                } else if (!merged && previous === grid[i][j]) {
                    newColumn[0] = grid[i][j] * 2;
                    score += grid[i][j] * 2;
                    merged = true;
                } else {
                    newColumn.unshift(grid[i][j]);
                    previous = grid[i][j];
                    merged = false;
                }
            }
        }
        
        while (newColumn.length < 4) {
            newColumn.unshift(0);
        }
        
        //тоже обновляем колонку
        for (let i = 0; i < 4; i++) {
            if (grid[3 - i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[3 - i][j] = newColumn[i];
        }
    }
    
    return moved;
}


function checkGameOver() {
    //это проверка на пустые клетки
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    //это- на возможные ходы
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const current = grid[i][j];
            //проверяем ячейки справа и снизу
            if ((i < 3 && grid[i + 1][j] === current) ||
                (j < 3 && grid[i][j + 1] === current)) {
                return false;
            }
        }
    }
    
    GameOver();
    return true;
}



function GameOver() {
    const gameOverContainer = document.getElementById('game-over');
    if (!gameOverContainer) return;//если нет то выходим
    const message = document.getElementById('game-over-message');
    const nameInput = document.getElementById('player-name');
    const saveBtn = document.getElementById('save-score-btn');
    
    message.textContent = 'Игра окончена! Введите ваше имя:';
    nameInput.style.display = 'block';
    nameInput.value = '';
    saveBtn.textContent = 'Сохранить результат';
    
    gameOverContainer.style.display = 'flex';
    hideMobileControls();
}

function saveScore() {
    const playerName = document.getElementById('player-name').value.trim();
    const message = document.getElementById('game-over-message');
    const nameInput = document.getElementById('player-name');
    const saveBtn = document.getElementById('save-score-btn');
    
    if (playerName === '') {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    

    nameInput.style.display = 'none';
    message.textContent = 'Ваш рекорд сохранен!';
    saveBtn.textContent = 'Сохранено';
    
    const record = {
        name: playerName,
        score: score,
        date: new Date().toLocaleString('ru-RU')
    };
    
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(record);
    const res = leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(res));
    
    console.log('Сохранен результат для:', playerName, ', результат:', score);
}

function restartGame() {
    initGame();
}



//собрать лидерборд
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const tbody = document.getElementById('leaderboard-body');
    
    if (!tbody) return; //если элемента нет на странице, выходим
    
    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-records">Пока нет рекордов</td></tr>';
        return;
    }
    
    tbody.innerHTML = leaderboard.map((record, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${record.name}</td>
            <td>${record.score}</td>
            <td>${record.date}</td>
        </tr>
    `).join('');
}



//контроллеры и перемещение ячеек в целом
function showMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls && window.innerWidth <= 768) {
        mobileControls.classList.add('active');
    }
}

function hideMobileControls() {
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.remove('active');
    }
}

//мобильные контроллеры
function handleMobileControl(direction) {
    move(direction);
}

//десктопные штуки
function handleKeyPress(event) {
    if (window.innerWidth > 768) { 
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down', 
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (directions[event.key]) {
            event.preventDefault();
            // тут двигаем ячейки
            move(directions[event.key]);
        }


        //отменяем
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            undoMove();
        }
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('save-score-btn');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const undoBtn = document.getElementById('undo-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveScore);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', restartGame);
    }

    if (undoBtn) {
        undoBtn.addEventListener('click', undoMove);
    }

    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            handleMobileControl(direction);
        });
    });

    document.addEventListener('keydown', handleKeyPress);

    loadLeaderboard();
    initGame();

});