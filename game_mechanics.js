let grid = [];
let score = 0;
let gameStarted = false;

function initGame() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameStarted = true;
    updateScore();
    addRandomTile();
    addRandomTile();
    renderGrid();
    showMobileControls();
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
                tile.style.transform = `translate(${j * (100 + 10)}%, ${i * (100 + 10)}%)`;
                cell.appendChild(tile);
            }
            
            gridContainer.appendChild(cell);
        }
    }
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
    
//cохраняем в localStorage!
    const score = parseInt(document.getElementById('score').textContent) || 0;
    const record = {
        name: playerName,
        score: score,
        date: new Date().toLocaleString('ru-RU')
    };
    
    //либо получаем текущий массив либо создаем, если пусто
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    leaderboard.push(record);
    
    //сортируем по убыванию
    const res = leaderboard.sort((a, b) => b.score - a.score);
    
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('leaderboard', JSON.stringify(res));
    
    console.log('Сохранен результат для:', playerName, ', результат:', score);
}

function restartGame() {
    const gameOverContainer = document.getElementById('game-over');
    if (gameOverContainer) {
        gameOverContainer.style.display = 'none';
    }
    showMobileControls();
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
    // логика перемещения ячеек
    console.log('Движение:', direction);
    //двигаем
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
            console.log('Клавиша:', directions[event.key]);
        }
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('save-score-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveScore);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
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
    showMobileControls();
    initGame();

});