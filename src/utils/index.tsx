import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOBMS } from "../constants/index";
import { Cell, CellValue, CellState } from "../types/index";

export const generateCells = () => {
  let cells: Cell[][] = [];

  //generating cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open, //TODO: Make it open
      });
    }
  }

  //randomly put 10bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOBMS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
    cells[randomRow][randomCol] = {
      ...cells[randomRow][randomCol],
      value: CellValue.bomb,
    };
    bombsPlaced++;
  }

  //calculate bombs for each cell
  for (let rowIdx = 0; rowIdx < MAX_ROWS; rowIdx++) {
    for (let colIdx = 0; colIdx < MAX_COLS; colIdx++) {
      const currentCell = cells[rowIdx][colIdx];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }
      //pretty shit but it works
      let numberOfBombs = 0;
      const topLeftBomb =
        rowIdx > 0 && colIdx > 0 ? cells[rowIdx - 1][colIdx - 1] : null;
      const topBomb = rowIdx > 0 ? cells[rowIdx - 1][colIdx] : null;
      const topRightBomb =
        rowIdx > 0 && colIdx < MAX_COLS - 1
          ? cells[rowIdx - 1][colIdx + 1]
          : null;
      const leftBomb = colIdx > 0 ? cells[rowIdx][colIdx - 1] : null;
      const rightBomb =
        colIdx < MAX_COLS - 1 ? cells[rowIdx][colIdx + 1] : null;
      const bottomLeftBomb =
        rowIdx < MAX_ROWS - 1 && colIdx > 0
          ? cells[rowIdx + 1][colIdx - 1]
          : null;
      const bottomBomb =
        rowIdx < MAX_ROWS - 1 ? cells[rowIdx + 1][colIdx] : null;
      const bottomRightBomb =
        rowIdx < MAX_ROWS - 1 && colIdx < MAX_COLS - 1
          ? cells[rowIdx + 1][colIdx + 1]
          : null;

      if (topLeftBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRightBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (leftBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (rightBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeftBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRightBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIdx][colIdx] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};
