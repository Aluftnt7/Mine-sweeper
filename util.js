//load Util first, conact util to html!







function stopTimer() {
    clearInterval(gInterval)
}


function startTimer() {
    var startTime = new Date().getTime();
    gInterval = setInterval(timer, 2, startTime);

}

function timer(startTime) {
    var time = document.querySelector('.timer')
    var updateTime = new Date().getTime();
    var difference = updateTime - startTime;
    var seconds = Math.floor(difference / 1000)
    time.innerText = seconds;

}


function resetTimer() {
    var elTimer = document.querySelector('.timer')
    stopTimer()
    elTimer.innerText = '0'

}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getEmptyCells(board) {
    var res = []
    for (var i = 0; i < board.length; i++) {
        var currRow = board[i]
        for (var j = 0; j < board[0].length; j++) {
            var currCell = currRow[j];
            if (currCell.isMine === false) {
                res.push({
                    i: i,
                    j: j
                })
            }
        }
        if (currCell.isMine === true) {
            continue
        }
    }
    return res
}




function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}