import React, { useEffect, useState } from "react";

import "./app.styles.scss";

import NumberDisplay from "../number-display/number-display.component";
import { generateCells, openMultipleCells } from "../../utils/index";
import Button from "../button/button.component";
import { Cell, Face, CellState, CellValue } from "../../types/index";
import { MAX_ROWS, MAX_COLS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile_face);
  const [time, setTime] = useState<number>(0);
  const [isLive, setLive] = useState<boolean>(false);
  const [bombCounter, setBombmCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  //Face changer
  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Face.scared_face);
    };
    const handleMouseUp = () => {
      setFace(Face.smile_face);
    };

    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  //Timer
  useEffect(() => {
    if (isLive && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isLive, time]);

  //Loser
  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost_face);
    }
  }, [hasLost]);

  //Winner
  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.won_emoji);
    }
  }, [hasWon]);

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => (
        <Button
          key={`Row: ${rowIdx} Col: ${colIdx}`}
          state={cell.state}
          value={cell.value}
          red={cell.red}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIdx}
          col={colIdx}
        />
      ))
    );
  };

  const showAllBobms = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
      })
    );
  };

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    //starts the game

    if (!isLive && !hasLost) {
      let newCells = cells.slice();

      const currentCell = newCells[rowParam][colParam];

      if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
        return;
      }

      if (currentCell.value === CellValue.bomb) {
        setHasLost(true);
        setFace(Face.lost_face);
        newCells[rowParam][colParam].red = true;
        newCells = showAllBobms();
        setCells(newCells);
        return;
      } else if (currentCell.value === CellValue.none) {
        newCells = openMultipleCells(newCells, rowParam, colParam);
      } else {
        newCells[rowParam][colParam].state = CellState.visible;
      }

      //Check to see if won
      let safeOpenCellsExists = false;
      for (let row = 0; row < MAX_ROWS; row++) {
        for (let col = 0; col < MAX_COLS; col++) {
          const currentCell = newCells[row][col];

          if (
            currentCell.value !== CellValue.bomb &&
            currentCell.state === CellState.open
          ) {
            safeOpenCellsExists = true;
            break;
          }
        }
      }

      if (!safeOpenCellsExists) {
        newCells = newCells.map((row) =>
          row.map((cell) => {
            if (cell.value === CellValue.bomb) {
              return {
                ...cell,
                state: CellState.flagged,
              };
            }
            return cell;
          })
        );
        setHasWon(true);
      }

      setCells(newCells);
    } else {
      return;
    }
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (isLive) {
      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state === CellState.visible) {
        return;
      } else if (currentCell.state === CellState.open) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setBombmCounter(bombCounter - 1);
      } else if ((currentCell.state = CellState.flagged)) {
        currentCells[rowParam][colParam].state = CellState.open;
        setCells(currentCells);
        setBombmCounter(bombCounter + 1);
      }
    } else {
      return;
    }
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
