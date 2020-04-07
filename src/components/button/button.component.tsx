import React from "react";

import "./button.styles.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => (
  <div className={`Button ${state === CellState.open ? "open" : ""}`}></div>
);

export default Button;
