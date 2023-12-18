export type CharStates = "incomplete" | "correct" | "incorrect" | "corrected";

export type CharStats = {
  character: string;
  isFirstCharacter: boolean;
  typed: string | null;
  deleted: boolean;
  index: number;
  state: CharStates;
  timeToCorrect: number | null;
};

export type FrameStats = {
  wpm: number;
  textLength: number;
  totalTime: number;
  text: string;
};
