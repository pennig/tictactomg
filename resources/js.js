(function () {
	var board = document.getElementById('board');
	var cellSize = 72;
	var subBoardBorder = 4;
	var subBoardInset = 4;
	var boardOutline
	var boardBorder = 12;
	var subBoardSize = cellSize * 3 + subBoardBorder * 2;
	var boardSize = subBoardSize * 3 + boardBorder * 2;
	var glyphThickness = 10;

	var playerOneColor = '#c0392b';
	var playerTwoColor = '#3498db';
	var playableColor = '#27ae60';
	var unplayableColor = '#222';
	var gridColor = 'rgba(0,0,0,0.25)';

	board.height = boardSize;
	board.width = boardSize;
	board.style.width = boardSize+'px';
	board.style.height = boardSize+'px';

	var ctx = board.getContext('2d');

	drawSubBoard(0, 0, {
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 1,
		playable: false
	});
	drawSubBoard(1, 0, {
		winner: 1,
		moves: [0,1,2,0,1,0,2,1,2],
		solution: 5,
		playable: true
	});
	drawSubBoard(2, 0, {
		winner: 2,
		moves: [2,0,1,0,2,1,0,0,2],
		solution: 7,
		playable: false
	});
	drawSubBoard(0, 1, {
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 2,
		playable: false
	});
	drawSubBoard(1, 1, {
		winner: 2,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 3,
		playable: false
	});
	drawSubBoard(2, 1, {
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 4,
		playable: false
	});
	drawSubBoard(0, 2, {
		winner: 1,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 6,
		playable: false
	});
	drawSubBoard(1, 2, {
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 8,
		playable: false
	});
	drawSubBoard(2, 2, {
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 0,
		playable: false
	});

/*
	{
		winner: 0,
		moves: [0,1,2,0,0,1,1,2,1],
		solution: 0,
		playable: true
	}
*/

	function drawSubBoard(x, y, data) {
		ctx.save();

		var xOffset = (subBoardSize+boardBorder)*x;
		var yOffset = (subBoardSize+boardBorder)*y;
		ctx.translate(xOffset, yOffset);

		// Background
		if (data.winner) {
			ctx.fillStyle = (data.winner == 1 ? playerOneColor : playerTwoColor);
			ctx.fillRect(0,0,subBoardSize,subBoardSize);
		}

		// Border
		ctx.strokeStyle = data.playable ? playableColor : unplayableColor;
		ctx.lineWidth = boardBorder/2;
		ctx.strokeRect(-boardBorder/4, -boardBorder/4, subBoardSize+boardBorder/2, subBoardSize+boardBorder/2);

		// Grid
		ctx.fillStyle = data.playable ? playableColor : gridColor;
		ctx.beginPath();
		ctx.rect(cellSize, subBoardInset, subBoardBorder, subBoardSize-subBoardInset*2);
		ctx.rect(cellSize*2+subBoardBorder, subBoardInset, subBoardBorder, subBoardSize-subBoardInset*2);
		ctx.rect(subBoardInset, cellSize, subBoardSize-subBoardInset*2, subBoardBorder);
		ctx.rect(subBoardInset, cellSize*2+subBoardBorder, subBoardSize-subBoardInset*2, subBoardBorder);
		ctx.fill();

		// Moves
		ctx.lineWidth = glyphThickness;
		ctx.lineCap = 'round';
		data.moves.forEach(function (move, index) {
			var fn;
			if (move == 1) {
				ctx.strokeStyle = data.winner ? 'rgba(255,255,255,0.25)' : playerOneColor;
				fn = drawX;
			} else if (move == 2) {
				ctx.strokeStyle = data.winner ? 'rgba(255,255,255,0.25)' : playerTwoColor;
				fn = drawO;
			} else {
				fn = function(){};
			}

			fn(index % 3, Math.floor(index/3));
		});

		// Solution
		if (data.solution) {
			drawSolution(data.solution, data.winner == 1 ? playerOneColor : playerTwoColor);
		}

		ctx.restore();
	}

	function drawX(x, y) {
		ctx.save();
		var xOffset = (cellSize+subBoardBorder)*x;
		var yOffset = (cellSize+subBoardBorder)*y;

		ctx.translate(xOffset, yOffset);

		ctx.beginPath();
		ctx.moveTo(glyphThickness/2+subBoardInset, glyphThickness/2+subBoardInset);
		ctx.lineTo(cellSize-glyphThickness/2-subBoardInset, cellSize-glyphThickness/2-subBoardInset);
		ctx.moveTo(glyphThickness/2+subBoardInset, cellSize-glyphThickness/2-subBoardInset);
		ctx.lineTo(cellSize-glyphThickness/2-subBoardInset, glyphThickness/2+subBoardInset);
		ctx.stroke();

		ctx.restore();
	}

	function drawO(x, y) {
		ctx.save();
		var xOffset = (cellSize+subBoardBorder)*x;
		var yOffset = (cellSize+subBoardBorder)*y;

		ctx.translate(xOffset, yOffset);

		ctx.beginPath();
		ctx.arc(cellSize/2, cellSize/2, cellSize/2-glyphThickness/2-subBoardInset, 0, Math.PI * 2, false);
		ctx.stroke();

		ctx.restore();
	}

	function drawSolution(solution, color) {
		ctx.save();

		var x1, x2, y1, y2;

		if (solution == 1) {
			x1 = cellSize/2;
			x2 = subBoardSize-cellSize/2;
			y1 = y2 = cellSize/2;
		} else if (solution == 2) {
			x1 = cellSize/2;
			x2 = subBoardSize-cellSize/2;
			y1 = y2 = (cellSize+subBoardBorder)+ cellSize/2;
		} else if (solution == 3) {
			x1 = cellSize/2;
			x2 = subBoardSize-cellSize/2;
			y1 = y2 = (cellSize+subBoardBorder) * 2 + cellSize/2;
		} else if (solution == 4) {
			y1 = cellSize/2;
			y2 = subBoardSize-cellSize/2;
			x1 = x2 = cellSize/2;
		} else if (solution == 5) {
			y1 = cellSize/2;
			y2 = subBoardSize-cellSize/2;
			x1 = x2 = (cellSize+subBoardBorder) + cellSize/2;
		} else if (solution == 6) {
			y1 = cellSize/2;
			y2 = subBoardSize-cellSize/2;
			x1 = x2 = (cellSize+subBoardBorder) * 2 + cellSize/2;
		} else if (solution == 7) {
			x1 = y1 = cellSize/2;
			x2 = y2 = subBoardSize-cellSize/2;
		} else if (solution == 8) {
			x1 = y2 = cellSize/2;
			x2 = y1 = subBoardSize-cellSize/2;
		}

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineCap = 'round';
		ctx.lineWidth = glyphThickness*2;
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.25)';
		ctx.stroke();
		ctx.lineWidth = glyphThickness;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.restore();
	}
})();