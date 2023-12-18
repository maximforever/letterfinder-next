export type CharStates = "incomplete" | "correct" | "incorrect" | "corrected";

export type CharStats = {
  character: string;
  isFirstCharacter: boolean;
  typed: string | null;
  deleted: boolean;
  index: number;
  state: CharStates;
  startTime: number | null;
  timeToType: number | null;
  timeToTypeCorrectly: number | null;
};

export type CompletedFrameStats = {
  wpm: number;
  textLength: number;
  totalTime: number;
  text: string;
};

export type CompletedFrameResults = {
  text: string;
  timeToComplete: number;
  charStats: CharStats[];
};
