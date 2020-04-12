import React, { useEffect, useState } from "react";

import "./app.styles.scss";

import NumberDisplay from "../number-display/number-display.component";
import { generateCells } from "../../utils/index";
import Button from "../button/button.component";
import { Cell, Face, CellState } from "../../types/index";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile_face);
  const [time, setTime] = useState<number>(0);
  const [isLive, setLive] = useState<boolean>(false);
  const [bombCounter, setBombmCounter] = useState<number>(10);

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

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => (
        <Button
          key={`Row: ${rowIdx} Col: ${colIdx}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIdx}
          col={colIdx}
        />
      ))
    );
  };

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    //starts the game
    if (!isLive) {
      setLive(true);
    }
  };

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (!isLive) {
      return;
    }

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
  };

  const handleFaceClick = (): void => {
    if (isLive) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
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
