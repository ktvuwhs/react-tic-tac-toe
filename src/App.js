import {useState} from 'react';

export default function App({size}) {
  /* using state variables to keep track of whose turn it is
   * as well as a history of moves made
   */
  const [history, setHistory] = useState([Array(size * size).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // even moves are player X since X starts on move 0
  const playerX = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // updates the history and whose turn it is
  function handlePlay(boardState) {
    // keeps everything from move 0 to the currentMove, and appends the next board state
    // note that the current move could be different than the last move made due to
    // being able to jump in different parts of the "move history"
    const nextHistory = [...history.slice(0, currentMove + 1), boardState];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(moveNumber) {
    setCurrentMove(moveNumber);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        {/* the board is rendered by passing in all the state variables
          * the onPlay function is the function that will run in a square
          * every time a square is clicked on the board
          */}
        <Board size={size}
               playerX={playerX}
               squares={currentSquares}
               onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({size, playerX, squares, onPlay}) {
  function handleClick(i) {
    // if the user clicks an already filled square, or if someone has won the game, then return
    if (squares[i] || calculateWinner(squares, size)) {
      return;
    }

    const boardState = squares.slice();  // create deep copy of the squares array
    
    if (playerX) {
      boardState[i] = 'X';
    } else {
      boardState[i] = 'O';
    }

    onPlay(boardState);
  }

  /* this function returns a function that calls the handleClick function with a specific value for i
   * note that by doing it this way, the value of i that was passed is "bound" to the lambda that was returned
   * e.g., calling runHandleClick(5) returns () => handleClick(5), where the 5 is static
   */
  function runHandleClick(i) {
    return () => handleClick(i);
  }

  const winner = calculateWinner(squares, size);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (playerX ? "X" : "O");
  }


  let board = [];
  let counter = 0;
  let row;
  for (row = 0; row < size; ++row) {
    let boardRow = [];

    for (let col = 0; col < size; ++col) {
      boardRow.push(
        <Square key={counter}
                value={squares[counter]}
                onSquareClick={runHandleClick(counter)} />
      );
      ++counter;
    }

    board.push(
      <div key={row} className="board-row">
        {boardRow}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}


function Square({value, onSquareClick}) {
  return <button className="square"
                 onClick={onSquareClick}>
          {value}</button>;
}

function calculateWinner(boardArr, size) {
  const board = [];
  for (let i = 0; i < boardArr.length; i += size) {
    board.push(boardArr.slice(i, i+size));
  }
  const endOfBoard = board.length-1;
  

  for (let row = 0; row < board.length; ++row) {
    for (let col = 1; col < board.length; ++col) {
      if (board[row][col]) {
        if (board[row][col] !== board[row][col-1]) {
          break;
        }
        if (col == endOfBoard) {
          return board[row][col];
        }
      }
    }
  }

  for (let col = 0; col < board.length; ++col) {
    for (let row = 1; row < board.length; ++row) {
      if (board[row][col]) {
        if (board[row][col] !== board[row-1][col]) {
          break;
        }
        if (row == endOfBoard) {
          return board[row][col];
        }
      }
    }
  }

  for (let diag = 1; diag < board.length; ++diag) {
    if (board[diag][diag]) {
      if (board[diag][diag] !== board[diag-1][diag-1]) {
        break;
      }

      if (diag == endOfBoard) {
        return board[diag][diag];
      }
    }
  }

  for (let diag = 1; diag < board.length; ++diag) {
    const reverseRow = endOfBoard - diag;
    if (board[reverseRow][diag]) {
      if (board[reverseRow][diag] !== board[reverseRow + 1][diag-1]) {
        break;
      }

      if (diag == endOfBoard) {
        return board[reverseRow][diag];
      }
    }
  }

  return null;
}