'use strict'
const BOMB = '&#128163';
const CLEAR = '';
const FLAG = '&#128681';
const LIFE = `<img style="height: 30px;" src="img/life.jpg">`;
const LOSE = '&#128128';
const WIN = '&#128526';
const FINE = '&#128125';

var gBoard;
var gLifeCount = 3;
var gIsFirstClick = true
var gSafeClickcounter = 3;
var gIsHintOn = false;
var gAlertTimeout;
var gManuallyMines = false;
var gManuallyMinesCount;

// var gBestTime = localStorage.setItem('Best Time', 'is not determined')
// document.getElementById("result").innerHTML = `Best time is: ${gBestTime}`;

var gLevel = {
    SIZE: 4,
    MINES: 2,
    NOTMINES: 14
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

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

function init() {
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard, '.game-board')
    renderLife(gLifeCount)
    renderHint()
    renderEmoji(FINE);
    gIsHintOn = false
    gHintCounter = 3
    gManuallyMines = false;
}

function restart() {
    clearInterval(gStopWatch);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '0.000'
    gIsFirstClick = true
    gLifeCount = 3;
    gSafeClickcounter = 3;
    gBoard = buildBoard(gLevel);
    renderBoard(gBoard, '.game-board')
    renderLife(gLifeCount)
    renderEmoji(FINE);
    gIsHintOn = false
    gHintCounter = 3
    gManuallyMines = false;
}

function renderLife(lifeCount) {
    var elLife = document.querySelector('.life');
    var strHtml = ''
    for (var i = 0; i < lifeCount; i++) {
        strHtml += LIFE
    }
    elLife.innerHTML = strHtml
}

function renderEmoji(mood) {
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerHTML = mood;
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
    return board;
}

function getMines(i, j) {
    var notMine = gBoard[i][j];
    for (var l = 0; l < gLevel.MINES; l++) {
        var mine = getMine(gLevel);
        gBoard[mine.i][mine.j].isMine = true;
        if (gBoard[mine.i][mine.j] === notMine) {
            gBoard[mine.i][mine.j].isMine = false;
            l--
        }
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
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
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
    if (gManuallyMines && gManuallyMinesCount > 0) {
        getMinesManually(i, j)
        return;
    }
    if (gIsFirstClick) {
        startGame(i, j)
        gIsFirstClick = false
    }
    if (!gGame.isOn) return;
    if (event.button === 0) {
        cellClicked(i, j);
        isGameWon(i, j)
    } else if (event.button === 2) {
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
    if (gIsHintOn) {
        var shownNges = revealNegs(cellI, cellJ, gBoard);
        console.log(shownNges)
        setTimeout(function() {
            hideNegs(cellI, cellJ, gBoard)
            for (var i = 0; i < shownNges.length; i++) {
                shownNges[i].isShown = true
            }
            renderBoard(gBoard);
            // gIsHintOn = false
        }, 1000)
    } else if (gBoard[cellI][cellJ].isMine) {
        isGameLost(cellI, cellJ)
        var elMine = document.getElementById(`${cellI},${cellJ}`);
        elMine.style.backgroundColor = 'rgb(158, 0, 0)';
        setTimeout(function() {
            elMine.style.backgroundColor = 'rgb(100, 100, 100)'
        }, 200)
        return;
    } else if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        revealNegs(cellI, cellJ, gBoard)
    }
    if (gIsHintOn) {
        gBoard[cellI][cellJ].isShown = true
        setTimeout(function() {
            gBoard[cellI][cellJ].isShown = false
            renderBoard(gBoard);
            gIsHintOn = false
        }, 1000)
    }
    gBoard[cellI][cellJ].isShown = true
    renderBoard(gBoard);
}

function startGame(i, j) {
    gGame.isOn = true
    startTimer()
    renderBoard(gBoard);
    if (gManuallyMines) return;
    getMines(i, j)
    getMinesAroundCount()
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
    if (flaggedMineCounter === gLevel.MINES && cellsShownCounter === gLevel.NOTMINES) {
        // getBestTime()
        clearTimeout(gAlertTimeout)
        renderEmoji(WIN)
        clearInterval(gStopWatch);
        var elMessage = document.querySelector('.alerts')
        elMessage.style.display = 'block'
        elMessage.innerText = 'You won the game!'
        gGame.isOn = false;
    }
}

function isGameLost(i, j) {
    if (gBoard[i][j].isMine) {
        gLifeCount--
        var elMessage = document.querySelector('.alerts')
        elMessage.style.display = 'block'
        renderEmoji(LOSE)
        if (gLifeCount === 2 || gLifeCount === 1) {
            elMessage.innerText = `You lost 1 life! You have ${gLifeCount} left`
        } else {
            elMessage.innerText = 'You lost the game!'
        }
        gAlertTimeout = setTimeout(function() {
            renderEmoji(FINE)
            elMessage.style.display = 'none'
        }, 1000)
        renderLife(gLifeCount)
        if (gLifeCount === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[0].length; j++) {
                    if (gBoard[i][j].isMine) {
                        gBoard[i][j].isShown = true;
                        renderBoard()
                    }
                }
            }
            clearInterval(gStopWatch);
            clearTimeout(gAlertTimeout)
            renderEmoji(LOSE);
            gGame.isOn = false;
        }
    }
}