export type CharStates = "incomplete" | "correct" | "incorrect" | "corrected";

export type CharStats = {
  character: string;
  typed: string | null;
  deleted: boolean;
  index: number;
  state: CharStates;
  timeToCorrect: number | null;
};
