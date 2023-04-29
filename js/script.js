

const statusDisplay = document.getElementById('status')
const countField = document.getElementById('numberTurns')
const startBox = document.getElementById('startBox')
const playField = document.getElementById('field')
const player1_name = document.getElementById('player1_name')
const player1 = document.getElementById('player1')


let gameActive = true
let currentPlayer = 'X'
let gameState = [] 
let cols, rows, steps;
let counter = 0;

const winnMessage = () => `${currentPlayer} has won!`
const nobodyWinsMessage = () => `it's a draw!`

let handleStart = () => {           
    player1.innerHTML = player1_name.value === '' ? 'Player \'X\'' : player1_name.value
    player2.innerHTML = player2_name.value === '' ? 'Bot\'O\''  : player2_name.value
    cols = checkInput(document.getElementById('columns').value)
    rows = checkInput(document.getElementById('columns').value)
    steps = checkInput(document.getElementById('steps').value)
    if(steps>cols) steps=cols;
    createMatrix()
    drawField()
    startBox.className = 'hidden' 
    document.querySelectorAll('.cell')
        .forEach(cell => cell.addEventListener('click', handleClick))
}

let checkInput = (input) => {
    input = +input
    input = (input < 4)
        ? 4
        : (input > 10)
            ? 10
            : input
    return input
}
let createMatrix = () => {         
    for (let i = 0; i < rows; i++) {
        arr = []
        for (let j = 0; j < cols; j++) {
            arr[j] = 0
        }
        gameState[i] = arr
    }
    console.log(gameState)
}
const drawField = () => {
    const cellSize = window.innerHeight * 0.5 / cols
    const box = document.createElement('div')
    box.id = 'container'

    let html = ''
    for (let i = 0; i < rows; i++) {
        html += `<div class="row">`
        for (let j = 0; j < cols; j++) {
            html += `<div id="${i}_${j}" class="cell" style="width: ${cellSize}px; height: ${cellSize}px; line-height: ${cellSize}px; font-size: ${cellSize / 16}em;"></div>`
        }
        html += `</div>`
    }
    box.innerHTML = html
    playField.appendChild(box)
}



const handleClick = (event) => {
    const clickedIndex = event.target.id.split('_').map(Number)
    const [i, j] = clickedIndex

    if (gameState[i][j] !== 0 || !gameActive) {
        return
    }

    gameState[i][j] = currentPlayer === 'X' ? 1 : 2
    event.target.textContent = currentPlayer
    countField.textContent = `${++counter}`
    isWinning(i, j)
    isMovesLeft()
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
    handlePlayerSwitch()
    //console.log(gameState)
}

let handlePlayerSwitch = () => {
    
    if (currentPlayer !== 'X')
    {
        // Bot plays
        setTimeout(() => 
        {
            let i = Math.floor(Math.random() * rows)
            let j = Math.floor(Math.random() * cols)

            while (gameState[i][j] !== 0) {        
                i = Math.floor(Math.random() * rows)    
                j = Math.floor(Math.random() * cols)
            }

            gameState[i][j] = 2    
            let cell = document.getElementById(`${i}_${j}`)    
            cell.innerHTML = currentPlayer
            countField.innerHTML = `${++counter}`

            isWinning(i, j)
            isMovesLeft()
            currentPlayer = 'X'
            handlePlayerSwitch()
        }, 500) // Delay the bot's move for half a second
    }
}

let isMovesLeft = () => {
    if (counter === cols * rows) {
        statusDisplay.innerHTML = nobodyWinsMessage()
        gameActive = false
    }
}

let isWinning = (y, x) => {
    let winner = currentPlayer === 'X' ? 1 : 2,
        length = steps * 2 - 1,
        radius = steps - 1,
        countWinnMoves, winnCoordinates

    // horizontal
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y, j = x - radius, k = 0; k < length; k++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // vertical
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - radius, j = x, k = 0; k < length; k++, i++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // oblique to the right
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - radius, j = x - radius, k = 0; k < length; k++, i++, j++) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }

    // oblique to the left
    countWinnMoves = 0
    winnCoordinates = []
    for (let i = y - radius, j = x + radius, k = 0; k < length; k++, i++, j--) {
        if (i >= 0 && i < rows && j >= 0 && j < cols &&
            gameState[i][j] === winner && gameActive) {
            winnCoordinates[countWinnMoves++] = [i, j]
            if (countWinnMoves === steps) {
                winnActions(winnCoordinates)
                return
            }
        } else {
            countWinnMoves = 0
            winnCoordinates = []
        }
    }
}


const winnActions = (winner) => {
    console.log(winner)

    gameActive = false
    statusDisplay.textContent = winnMessage()
    statusDisplay.style.color = '#008000'

    let cell
    for (let i = 0; i < winner.length; i++) {
        cell = document.getElementById(`${winner[i][0]}_${winner[i][1]}`)
        cell.style.color = '#008000'
    }
}


let handlePlayAgain = () => {
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = player2.style.background = '#d0bdf4'
    playField.removeChild(document.getElementById('container'))
    handleStart()
}

let handleRestart = () => {
    gameActive = true
    currentPlayer = 'X'
    counter = 0
    countField.innerHTML = '0'
    statusDisplay.innerHTML = ''
    statusDisplay.style.color = 'black'
    player1.style.background = player2.style.background = '#d0bdf4'
    player1_name.value = player2_name.value = ''
    player1.innerHTML = player2.innerHTML = '-'
    startBox.className = 'sidebar'
    playField.removeChild(document.getElementById('container'))
}

document.querySelector('#start').addEventListener('click', handleStart) 
document.querySelector('#playAgain').addEventListener('click', handlePlayAgain)
document.querySelector('#restart').addEventListener('click', handleRestart)
