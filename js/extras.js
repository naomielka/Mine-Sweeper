const HINT = '&#128161'
var gHintCounter = 3;

function renderHint() {
    for (var i = 1; i <= 3; i++) {
        var elHint = document.getElementById(`hint${i}`);
        elHint.innerHTML = HINT;
    }
}

function getHint(elHint) {
    if (gHintCounter <= 0) return
    turnHintOff(elHint)
    gIsHintOn = true
    gHintCounter--;
    var elMessage = document.querySelector('.alerts')
    elMessage.style.display = 'block'
    elMessage.innerText = `You\'ve used a hint! You have ${gHintCounter} left`
    gAlertTimeout = setTimeout(function() {
        elMessage.style.display = 'none'
    }, 2000)
}

function turnHintOff(elHint) {
    elHint.style.opacity = '30%'
    document.getElementById(elHint.id).onclick = null;
}

function checkIfCellWasSafe(randI, randJ, safeCell1, safeCell2) {
    if (gSafeClickcounter === 2) {
        if (gBoard[randI][randJ] === safeCell1) {
            safeClick()
        }
    }
    if (gSafeClickcounter === 1) {
        if (gBoard[randI][randJ] === safeCell2) {
            safeClick()
        }
    }
}

function safeClick() {
    var randI = getRandomIntInclusive(0, gLevel.SIZE - 1);
    var randJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
    if (gSafeClickcounter === 3) {
        var safeCell1 = gBoard[randI][randJ]
    }
    if (gSafeClickcounter === 2) {
        var safeCell2 = gBoard[randI][randJ]
    }
    checkIfCellWasSafe(randI, randJ, safeCell1, safeCell2);
    if (gBoard[randI][randJ].isMine || gBoard[randI][randJ].isShown) {

        return safeClick();
    } else {
        if (gSafeClickcounter > 0) {
            gSafeClickcounter--
            var elCell = document.getElementById(`${randI},${randJ}`);
            elCell.style.backgroundColor = 'aquamarine';
            var elMessage = document.querySelector('.alerts')
            elMessage.style.display = 'block'
            elMessage.innerText = `You\'ve used 1 safe click! You have ${gSafeClickcounter} left`
            gAlertTimeout = setTimeout(function() {
                elMessage.style.display = 'none'
            }, 2000)
            setTimeout(function() {
                elCell.style.backgroundColor = 'rgb(100, 100, 100)'
            }, 500)
        } else {
            return;
        }
    }
}

function manualMinesOn() {
    if (!gIsFirstClick) return
    gManuallyMines = true
    gManuallyMinesCount = gLevel.MINES
}

function getMinesManually(cellI, cellJ) {
    gBoard[cellI][cellJ].isMine = true
    gManuallyMinesCount--
    var elMessage = document.querySelector('.alerts')
    elMessage.style.display = 'block'
    elMessage.innerText = `You have ${gManuallyMinesCount} mines left to place`
    gAlertTimeout = setTimeout(function() {
        elMessage.style.display = 'none'
    }, 2000)

}


// function getBestTime() {
//     var currTime = document.getElementById("current-time").innerText
//         // var bestTime = localStorage.getItem("Best Time")
//     if (+gBestTime > +currTime || gBestTime === 'is not determined') {
//         localStorage.setItem('Best Time', `${currTime}`)
//     }
//     document.getElementById("result").innerHTML = `Best time is: ${localStorage.bestTime}`;
// }