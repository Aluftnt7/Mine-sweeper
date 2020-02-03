'use strict'
const MINE = '*'
const EMPTY = ''
var gInterval
var gClickCount = 0
var gBoard
var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function initGame(size, mines) {
    var elBottun = document.querySelector('.smiley-button')
    elBottun.innerText = '😺'
    gGame.isOn = true
    gBoard = createBoard(size, mines)
    console.log('**** that ****');
    renderBoard(gBoard)
    spreadMines(gBoard, mines)
    minesCount(gBoard)
    resetTimer()
    gClickCount = 0
    gGame.shownCount = 0
    gGame.markedCount = 0

}



function createBoard(size, mines) {
    var board = [];
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}



function spreadMines(board, mines) {
    var minesCount = 0
    while (minesCount < mines) {
        var ranNum = getEmptyCells(board)
        var ran = shuffle(ranNum)
        var cellLocation = ran[0]
        board[cellLocation.i][cellLocation.j].isMine = true
        minesCount++

    }

}



function cellDisplay(cell) {
    var res = ''
    if (cell.isMine) {
        res = '*'
    } else if (cell.minesAroundCount !== 0) {
        res = cell.minesAroundCount
    } else {
        res = ' '
    }
    return res
}



function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var cell = ''
            var className = board[i][j].isMine ? `cell-${i}-${j} mine` : `cell-${i}-${j}`
            strHTML += `<td
            class ="cell hide ${className}" 
            onmousedown="cellClick(this,event, ${i}, ${j})" >
            ${cell}
            
            </td>`;
        }
        strHTML += `</tr>`;
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function setMinesNegsCount(board, rowIdx, colIdx) {
    var cnt = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMine) {
                cnt++
            }
        }
    }

    return cnt;
}



function minesCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var minesCount = setMinesNegsCount(board, i, j);
            board[i][j].minesAroundCount = minesCount
        }
    }
    renderBoard(board)

}



function cellClick(elCell, event, i, j) {
    if (gGame.isOn === false) {
        return
    }

    if (gClickCount === 0) {
        startTimer()
        gClickCount++
        gGame.isOn = true
    }


    var display = cellDisplay(gBoard[i][j])
    if (event.buttons === 1) {
        elCell.innerHTML = display
        event.srcElement.classList.remove('hide')
        gGame.shownCount++
            gBoard[i][j].isShown = true
        if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isMine === false) {
            revelSafeNegsCount(gBoard, i, j, elCell)
        }
        checkWin(gBoard)
        if (gBoard[i][j].isMine) {
            gameOver()
        }
    }

    if (event.buttons === 2) {
        if (gGame.isOn === false) {
            return
        }
        if (gBoard[i][j].isMarked === true) {
            gBoard[i][j].isMarked = false
        } else {
            gBoard[i][j].isMarked = true
        }

        cellMarked(elCell, i, j)
        checkWin(gBoard)
    }
}



function cellMarked(cell, i, j) {
    if (gGame.isOn === false) {
        return
    }
    if (gBoard[i][j].isMarked === true) {
        cell.innerHTML = '🚩'
        gGame.markedCount++
    } else {
        cell.innerHTML = ''
        gGame.markedCount--
    }
}


function gameOver() {
    var elMine = document.querySelectorAll('.mine')
    for (var i = 0; i < elMine.length; i++) {
        elMine[i].innerHTML = '💣'
        elMine[i].classList.remove('hide')
        gGame.isOn = false
        stopTimer()
        var elBottun = document.querySelector('.smiley-button')
        elBottun.innerText = '🙀'
    }
    console.log('game over');
}





function revelSafeNegsCount(board, rowIdx, colIdx, cell) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMine === false && board[i][j].isShown === false) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                    // console.log(elCell);
                var display = cellDisplay(gBoard[i][j])
                elCell.innerHTML = display
                elCell.classList.remove('hide')
                gGame.shownCount++
                    gBoard[i][j].isShown = true
                if (gBoard[i][j].minesAroundCount === 0) {
                    revelSafeNegsCount(gBoard, i, j);
                }
                // console.log(negsOfNegs);



            }
        }
    }
}



function checkWin(board) {
    var mineCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell.isMine) {
                mineCount++
            }

        }

    }
    if (gGame.shownCount === gBoard.length ** 2 - mineCount && mineCount === gGame.markedCount) {
        console.log('youwon');
        stopTimer()
        var elBottun = document.querySelector('.smiley-button')
        elBottun.innerText = '😻'
        gGame.isOn = false
    }

}





// function modify() {
//     var boardSize = +prompt('how big you want your board?')
//     while (boardSize < 16) {
//         boardSize = +prompt('pls choose a bigger number :)')
//     }
//     var mines = +prompt('how many mines would you like to play with?')
//     if (boardSize === 0 || mines === 0) {
//         return
//     }

//     boardSize = Math.abs(boardSize / 4)
//     initGame(boardSize, mines)
// }