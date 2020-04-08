import React, { useState } from "react";

import "./app.styles.scss";

import NumberDisplay from "../number-display/number-display.component";
import { generateCells } from "../../utils/index";
import Button from "../button/button.component";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => (
        <Button
          key={`Row: ${rowIdx} Col: ${colIdx}`}
          state={cell.state}
          value={cell.value}
          row={rowIdx}
          col={colIdx}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">
          <span role="img" aria-label="face">
            😀
          </span>
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
