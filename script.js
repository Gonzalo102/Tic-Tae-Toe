
//Factory Function
const Player = (sign, name) => {
    
    this.name = name;
    this.sign = sign;
  
    const getSign = () => {
        return sign;
    };

    const getName = ()=> {
        return name;
    }
  
    return { getSign, getName };
  };


//module
const Gameboard = (() => {
    
    let board = ['','','','','','','','','']

    //set sign
    const setSign = (index, sign) => {
        board[index] = sign;
    };

    //get field
    const getField = (index) => {
        return board[index];
    }

    //reset board
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return {board, setSign, getField, reset};
})();


//module
const gameController = (() => {

    let round = 1;
    let gameOver = false;
    let winner = false;
    let playerXName = undefined;
    let playerOName = undefined;

    let playerX = Player('X', playerXName);
    let playerO = Player('O', playerOName);

//controls the flow of the game

    const storageNames = (e) => {
        e.preventDefault()
       
        playerXName = document.getElementById('PlayerXname').value;
        playerOName = document.getElementById('PlayerOname').value;
        playerX = Player('X', playerXName);
        playerO = Player('O', playerOName);
    }

    const playRound = (e, squareindex) => {
        Gameboard.setSign(squareindex, getCurrentPlayerSign());
        checkWinner(squareindex);
    }

    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const getCurrentPlayerName = () => {
        return round % 2 === 1 ? playerX.getName() : playerO.getName();
    }

    const isGameOver = () => {
        return gameOver;
    }
    
    const checkWinner = (squareindex) => {

        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        
         winner = winConditions
        .filter((combination) => combination.includes(squareindex))
        .some((possibleCombination) => 
            possibleCombination.every(
                (index) => Gameboard.getField(index) === getCurrentPlayerSign()
            )
            );
        if (winner){
            gameOver = true;
        }

        return winner;

    }

    const getRound = () => {
        return round;
    }

    const incrementRound = () => {
        round++;
    }

    const restartGame = () => {
        winner = false;
        gameOver = false;
        round = 1;
    
    }
    return {playRound, getCurrentPlayerSign, checkWinner, incrementRound, isGameOver, restartGame, getRound, getCurrentPlayerName, storageNames};

})();

//module
displayController = (() => {
    //display the Game
        const container = document.querySelector('.container');
        const winnerDisplay = document.querySelector('.winner-display');
        const restartButton = document.querySelector('.restart-button');
        const namesButton = document.querySelector('.names-button');
        const squares = document.querySelectorAll('.square');
        const namesForm = document.querySelector('#form-players-name');
        const overlay = document.getElementById('overlay')

        namesForm.addEventListener('submit', (e) => gameController.storageNames(e));
        namesForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const modal = e.target.firstChild.nextSibling
            modal.classList.remove('active')
            overlay.classList.remove('active')
            gameController.restartGame();
            Gameboard.reset();
            resetGameboard();
        })

        namesButton.addEventListener('click', () => {
            const modal = namesForm.firstChild.nextSibling
            modal.classList.add('active')
            overlay.classList.add('active')
        })

        container.addEventListener('click', (e) => {
            if (Gameboard.board[parseInt(e.target.dataset.index)] !== '' || Gameboard.board[parseInt(e.target.dataset.index)] == 'X' || Gameboard.board[parseInt(e.target.dataset.index)] == 'O' || gameController.isGameOver() == true) return;
            gameController.playRound(e, parseInt(e.target.dataset.index));
            displayGameboard(e.target, parseInt(e.target.dataset.index));
            gameController.checkWinner(parseInt(e.target.dataset.index));
            displayWinnerMessage();
            gameController.incrementRound();
                
        })

        restartButton.addEventListener('click', (e) => {
            gameController.restartGame();
            Gameboard.reset();
            resetGameboard();
        })
    
        const displayGameboard = (e, index) => {
            e.textContent = Gameboard.board[index];
        }

        const displayWinnerMessage = () => {
            if(gameController.isGameOver() == false && gameController.getRound() < 9) return;
            if (gameController.isGameOver() == false && gameController.getRound() === 9) {
                winnerDisplay.textContent = "Its a Draw";
            } else {
                winnerDisplay.textContent = `The Winner is ${gameController.getCurrentPlayerName()}`;
            }
        }
        
        const resetGameboard = () => {
            squares.forEach(square => square.textContent = '');
            winnerDisplay.textContent = '';
        }
        
})();