const Player = (name, symbol) => {
    return { name, symbol };
};

const GameController = (function() {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const playTurn = (index) => {
        if (Gameboard.getBoard()[index] === null) {
            Gameboard.setCell(index, currentPlayer.symbol);
            switchPlayer();
        }
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    };

    const resetGame = () => {
        Gameboard.clearBoard();
        currentPlayer = player1;
    };

    return { getCurrentPlayer, playTurn, checkWinner, resetGame };
})();

const Gameboard = (function() {
    const board = Array(9).fill(null); // A 3x3 game board

    const getBoard = () => board;

    const setCell = (index, symbol) => {
        if (index >= 0 && index < board.length) {
            board[index] = symbol;
        }
    };

    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    return { getBoard, setCell, clearBoard };
})();

const Display = (function(){
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.querySelector('.current-player');
    const winnerDisplay = document.querySelector('.winner');
    const lastWinnerDisplay = document.querySelector('.last-winner');
    const timer = document.querySelector('.time');
    const timerDisplay = document.querySelector('#time');
    let lastWinner = null;

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateCurrentPlayer = (player) => {  
        currentPlayerDisplay.textContent = `${player.name}'s turn (${player.symbol})`;
    };

    const displayWinner = (winner) => {  
        winnerDisplay.textContent = winner ? `${winner} wins!` : 'It\'s a draw!';
    };

    const displayLastWinner = () => {  
        lastWinnerDisplay.textContent = lastWinner ? `Last winner: ${lastWinner}` : '';
    };

    const hideWinner = () => {
        winnerDisplay.textContent = "";
    };

    const hideTimer = () => {
        timer.style.display = 'none';
    };

    const showTimer = () => {
        timer.style.display = 'block';
    };

    const startTimer = (duration) => {
        let timer = duration, minutes, seconds;
        const interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerDisplay.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(interval);
                hideTimer();
                GameController.resetGame();
                updateBoard();
                updateCurrentPlayer(GameController.getCurrentPlayer());
                hideWinner();
                displayLastWinner();
            }
        }, 1000);
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            GameController.playTurn(index);
            updateBoard();
            const winner = GameController.checkWinner();
            if (winner) {
                displayWinner(winner);
                lastWinner = winner;
                showTimer();
                startTimer(10);
            } else {
                updateCurrentPlayer(GameController.getCurrentPlayer());
            }
        });
    });

    return { updateBoard, updateCurrentPlayer, displayWinner, displayLastWinner };
})();

document.addEventListener('DOMContentLoaded', () => {
    Display.updateBoard();
    Display.updateCurrentPlayer(GameController.getCurrentPlayer());
    Display.displayLastWinner(); // Display the last winner when the game starts
    document.querySelector('.time').style.display = 'none'; // Hide the timer initially
});
