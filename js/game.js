'use strict'
var gBoard;
const BOMB = '&#128163';
const CLEAR = ''
const FLAG = '&#128681'
var gLevel = {
    SIZE: 4,
    MINES: 2,
    NOTMINES: 14
};
const LIFE = `<img style="height: 30px;" src="img/life.jpg">`
var gLifeCount = 3
var gisFirstClick = true

function getLevel(level) {
    if (level === 'beginner') {
        gLevel = {
            SIZE: 4,
            MINES: 2,
            NOTMINES: 14
        };

    }
    if (level === 'medium') {
        gLevel = {
            SIZE: 8,
            MINES: 12,
            NOTMINES: 52
        };
    }
    if (level === 'expert') {
        gLevel = {
            SIZE: 12,
            MINES: 30,
            NOTMINES: 114
        };
    }
    gBoard = buildBoard(gLevel);
    getMinesAroundCount()
    renderBoard(gBoard, '.game-board')
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard, '.game-board')
    renderLife(gLifeCount)
}

function renderLife(lifeCount) {
    var elLife = document.querySelector('.life');
    var strHtml = ''
    for (var i = 0; i < lifeCount; i++) {
        strHtml += LIFE
    }
    elLife.innerHTML = strHtml
}

function buildBoard(level) {
    var board = [];
    for (var i = 0; i < level.SIZE; i++) {
        var row = [];
        board.push(row);
        for (var j = 0; j < level.SIZE; j++) {
            var cell = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isFlagged: false,
            }
            board[i][j] = cell
        }
    }
    // for (var l = 0; l < level.MINES; l++) {
    //     var mine = getMine(level);
    //     board[mine.i][mine.j].isMine = true
    // }
    console.log(board)
    return board;
}

function getMines() {
    for (var l = 0; l < gLevel.MINES; l++) {
        var mine = getMine(gLevel);
        gBoard[mine.i][mine.j].isMine = true;
    }

}

function getMine(level) {
    var randI = getRandomIntInclusive(0, level.SIZE - 1);
    var randJ = getRandomIntInclusive(0, level.SIZE - 1);
    var mineCell = {
        i: randI,
        j: randJ,
    };
    return mineCell
}

function getMinesAroundCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount;
        }
    }
}

function renderBoard() {
    var strHTML = '<table class="board"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) {
                    var cellContent = BOMB;
                } else {
                    cell.minesAroundCount = setMinesNegsCount(i, j, gBoard);
                    cellContent = cell.minesAroundCount
                }
            } else if (gBoard[i][j].isFlagged) {
                cellContent = FLAG
            } else {
                cellContent = ''
            }
            strHTML += `<td class="cell" id="${i},${j}" oncontextmenu="return false" onmousedown="leftOrRigthclick(event,${i},${j})"> ${cellContent} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elTable = document.querySelector('.game-board')
    elTable.innerHTML = strHTML;
}

function leftOrRigthclick(event, i, j) {
    if (gisFirstClick) {
        startGame()
        getMines()
        getMinesAroundCount()
        gisFirstClick = false
    }

    if (event.button === 0) {
        cellClicked(i, j);
        // startGame()
        isGameLost(i, j)
        isGameWon(i, j)
    } else if (event.button === 2) {
        // startGame()
        cellFlagged(i, j);
        isGameWon(i, j)
    } else {
        return;
    }

}

function cellFlagged(cellI, cellJ) {
    if (gBoard[cellI][cellJ].isFlagged) {
        gBoard[cellI][cellJ].isFlagged = false
        renderBoard(gBoard);
    } else {
        gBoard[cellI][cellJ].isFlagged = true
        renderBoard(gBoard);
    }
}

function cellClicked(cellI, cellJ) {
    gBoard[cellI][cellJ].isShown = true
    if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        revealNegs(cellI, cellJ, gBoard)
    }
    renderBoard(gBoard);
}

function startGame(elFirstCell) {
    // if (gGame.isOn) return
    gGame.isOn = true
    startTimer()
        // buildBoard(gLevel)
    renderBoard(gBoard);
    // console.log(elFirstCell.id)
}

function isGameWon(i, j) {
    var flaggedMineCounter = 0
    var cellsShownCounter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isFlagged) { flaggedMineCounter++ }
            if (!gBoard[i][j].isMine && gBoard[i][j].isShown) { cellsShownCounter++ }
        }
    }
    if (!flaggedMineCounter === gLevel.MINES) return
    if (!cellsShownCounter === gLevel.NOTMINES) return
    if (flaggedMineCounter === gLevel.MINES && cellsShownCounter === gLevel.NOTMINES) return console.log('win!')
}

function isGameLost(i, j) {
    if (gBoard[i][j].isMine) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true;
                    renderBoard()
                }
            }
        }
        clearInterval(gStopWatch);
        gGame.isOn = false
        return console.log('lose!')
    }
}