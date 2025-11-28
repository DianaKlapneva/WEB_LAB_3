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
    // потом продумаю логику перезапуска игры
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

document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('save-score-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveScore);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    loadLeaderboard();

});