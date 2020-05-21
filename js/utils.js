'use strict'

function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

function revealNegs(cellI, cellJ, board) {
    var shownNges = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isShown) {
                shownNges.push(board[i][j]);
            }
            board[i][j].isShown = true
                // if (board[i][j].minesAroundCount === 0) {
                //     // console.log(board[i][j])
                //     // revealNegs(i, j, board)
                // }
        }
    }
    return shownNges;
}

function hideNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            board[i][j].isShown = false
        }
    }
}

function renderCell(location, value) {
    var elCell = document.querySelector(`#${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var gStopWatch;

function startTimer() {
    var miliSeconds = 0;
    var microSeconds = 0;
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var time;
    gStopWatch = setInterval(function() {
        miliSeconds++
        time = miliSeconds
        if (miliSeconds === 1000) {
            miliSeconds++
            time += microSeconds
        }
        if (microSeconds === 100) {
            seconds++
            time += +seconds
        }
        if (seconds === 60) {
            minutes++
            time += minutes
        }
        if (minutes === 60) {
            hours++
            time += hours
        }
        renderTimer(time)

    }, 1)

}

function renderTimer(time) {
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = (time / 1000).toFixed(3)
}