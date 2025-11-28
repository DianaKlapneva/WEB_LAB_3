function GameOver() {
    const gameOverContainer = document.getElementById('game-over');
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
    
    //сохраним в localstorage
    console.log('Сохранен результат для:', playerName);
}

function restartGame() {
    document.getElementById('game-over').style.display = 'none';
    // потом продумаю логику перезапуска игры
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save-score-btn').addEventListener('click', saveScore);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    
    //пока что game over просто по таймеру чтобы посмотреть
    setTimeout(GameOver, 1000);
});