import {useState} from 'react';

export default function App({size}) {
  // squares is a "state array" initially filled with null
  const [squares, setSquares] = useState(Array(size * size).fill(null));
  const [playerX, setPlayerX] = useState(true);

  function handleClick(i) {
    const nextSquares = squares.slice();  // create deep copy of the squares array
    
    if (playerX) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    setSquares(nextSquares);  // use the setSquares function to assign nextSquares to squares
    setPlayerX(!playerX);
  }

  /* this function returns a function that calls the handleClick function with a specific value for i
   * note that by doing it this way, the value of i that was passed is "bound" to the lambda that was returned
   * e.g., calling runHandleClick(5) returns () => handleClick(5), where the 5 is static
   */
  function runHandleClick(i) {
    return () => handleClick(i);
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
  return board;
}


function Square({value, onSquareClick}) {
  return <button className="square"
                 onClick={onSquareClick}>
          {value}</button>;
}