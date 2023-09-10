export type CharStats = {
  char: string;
  index: number;
  state: "incomplete" | "correct" | "incorrect" | "corrected";
  timeToCorrect: number | null;
};
