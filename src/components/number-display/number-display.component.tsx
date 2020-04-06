import React from "react";
import "./number-display.styles.scss";

interface NumberDisplayProps {
  value: number;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  return (
    <div className="NumberDisplay">{value.toString().padStart(3, "0")}</div>
  );
};

export default NumberDisplay;
