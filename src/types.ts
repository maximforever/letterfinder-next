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
  frameAccuracy: number;
};

export type CompletedFrameResults = {
  text: string;
  timeToComplete: number;
  charStats: CharStats[];
};

export type ProcessedCharacterStats = {
  count: number;
  correct: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  averageTimeToCorrect: number;
  ratioOfAverageTimeToFrameAverage?: number;
  ratioOfAverageTimeToFrameMedian?: number;
};
