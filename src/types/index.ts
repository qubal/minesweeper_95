export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb,
}

export enum CellState {
  open,
  visible,
  flagged,
}

export type Cell = { value: CellValue; state: CellState; red?: boolean };

export enum Face {
  smile_face = "🙂",
  scared_face = "😱",
  lost_face = "☠️",
  won_emoji = "🌠",
}
