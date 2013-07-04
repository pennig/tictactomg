var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen(8008);

// routing
app.use("/r", express.static(__dirname + '/resources'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var game = null;

function newGame() {
    game = {
        currentPlayer: 1,
        boards:[]
    };
    for (var i=0; i<9; i++) {
        game.boards.push({
            winner: 0,
            moves: [0,0,0,0,0,0,0,0,0],
            solution: 0,
            playable: true
        });
    }

    io.sockets.emit('newgame', game);
}

function play(data) {
    var player = data.player;
    var boardIndex = data.boardIndex;
    var space = data.space;

    var board = game.boards[boardIndex];
    var moves = board.moves;

    if (game.currentPlayer != player || !board.playable || board.moves[space]) {
        // Players should match up!
        // Can't play on an unplayable board!
        // Can't play a space that has already been played!
        io.sockets.emit('error', {message: "Invalid move!", data: data});
        return;
    }

    // make the move
    game.boards[boardIndex].moves[space] = game.currentPlayer;

    // resolve solution, if not done already
    if (!board.solution) {
        var solution = 0;
        if (moves[0]==player && moves[1]==player && moves[2]==player) {
            solution = 1;
        } else if (moves[3]==player && moves[4]==player && moves[5]==player) {
            solution = 2;
        } else if (moves[6]==player && moves[7]==player && moves[8]==player) {
            solution = 3;
        } else if (moves[0]==player && moves[3]==player && moves[6]==player) {
            solution = 4;
        } else if (moves[1]==player && moves[4]==player && moves[7]==player) {
            solution = 5;
        } else if (moves[2]==player && moves[5]==player && moves[8]==player) {
            solution = 6;
        } else if (moves[0]==player && moves[4]==player && moves[8]==player) {
            solution = 7;
        } else if (moves[6]==player && moves[4]==player && moves[2]==player) {
            solution = 8;
        }

        if (solution) {
            board.solution = solution;
            board.winner = player;
        }
    }

    // mark the playable board(s)
    var fullBoard = true;
    for (var i=0; i<9; i++) {
        if (game.boards[space].moves[i] === 0) {
            fullBoard = false;
            break;
        }
    }
    game.boards.forEach(function (board, i) {
        var playable = false;
        if (fullBoard) {
            for (var s=0; s<9; s++) {
                if (board.moves[s] === 0) {
                    playable = true;
                    break;
                }
            }
        } else if (i == space) {
            playable = true;
        }
        board.playable = playable;
    });

    // switch player
    game.currentPlayer = !(game.currentPlayer-1) + 1; // 1 or 2

    io.sockets.emit('move', game);
}

// sockets
io.sockets.on('connection', function (socket) {
    socket.on('play', play);
    socket.on('newgame', newGame);
    socket.on('disconnect', function(){
    });
});
