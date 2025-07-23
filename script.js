const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modeSelect = document.getElementById('mode');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

drawBoard();

modeSelect.addEventListener('change', restartGame);
restartBtn.addEventListener('click', restartGame);

function drawBoard() {
  board.innerHTML = '';
  cells.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.textContent = value;

    if (value === 'X') cell.classList.add('X');
    if (value === 'O') cell.classList.add('O');

    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  makeMove(index, currentPlayer);

  const winner = checkWinner();
  if (winner) {
    statusText.textContent = `${winner} wins!`;
    gameActive = false;
    return;
  }

  if (!cells.includes('')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  const mode = modeSelect.value;
  if (mode !== 'pvp' && currentPlayer === 'O') {
    setTimeout(() => aiMove(mode), 300);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  drawBoard();
}

function aiMove(mode) {
  if (!gameActive) return;

  let index;
  if (mode === 'easy') {
    const empty = cells.map((val, i) => val === '' ? i : null).filter(i => i !== null);
    index = empty[Math.floor(Math.random() * empty.length)];
  } else {
    index = bestMove();
  }

  if (index !== undefined) {
    makeMove(index, 'O');
    const winner = checkWinner();
    if (winner) {
      statusText.textContent = `${winner} wins!`;
      gameActive = false;
    } else if (!cells.includes('')) {
      statusText.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = 'X';
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === '') {
      cells[i] = 'O';
      let score = minimax(cells, 0, false);
      cells[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const scores = { O: 1, X: -1, tie: 0 };

function minimax(boardState, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) return scores[result] || 0;
  if (!boardState.includes('')) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'O';
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = '';
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'X';
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = '';
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of wins) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

function restartGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  drawBoard();
}
