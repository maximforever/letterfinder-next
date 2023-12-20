import { CompletedFrameResults, ProcessedCharacterStats } from "@/types";

export function generatePerCharacterStats(frame: CompletedFrameResults) {
  const frameCharacterStats: { [key: string]: ProcessedCharacterStats } = {};
  const everyCharacter = frame.text.split("");

  // go through each character
  for (const character of everyCharacter) {
    // if don't already have it in stats
    if (frameCharacterStats[character] === undefined) {
      let countOfThisCharacter = 0;
      let countOfCorrect = 0;
      let totalTime = 0;
      let totalCorrectTime = 0;

      // again, go through each character
      for (const characterStat of frame.charStats) {
        if (characterStat.isFirstCharacter) {
          continue;
        }

        if (characterStat.character === character) {
          countOfThisCharacter += 1;
          countOfCorrect += characterStat.state === "correct" ? 1 : 0;
          totalTime += characterStat.timeToType;

          if (characterStat.state === "correct") {
            totalCorrectTime += characterStat.timeToTypeCorrectly;
          }
        }
      }

      const accuracy =
        Math.floor((countOfCorrect / countOfThisCharacter) * 10000) / 100;

      frameCharacterStats[character] = {
        count: countOfThisCharacter,
        correct: countOfCorrect,
        accuracy,
        totalTime,
        averageTime: Math.floor((totalTime / countOfThisCharacter) * 10) / 10,
        averageTimeToCorrect:
          Math.floor((totalCorrectTime / countOfCorrect) * 10) / 10,
      };
    }
  }

  return frameCharacterStats;
}

export function generateFrameStats(frame: CompletedFrameResults) {
  const perCharacterStats = generatePerCharacterStats(frame);
  const characterAverageTimes = [];

  for (const character in perCharacterStats) {
    if (perCharacterStats[character].correct > 0) {
      characterAverageTimes.push(
        perCharacterStats[character].averageTimeToCorrect
      );
    }
  }

  const frameAverageTimeToCorrect =
    Math.floor(average(characterAverageTimes) * 100) / 100;
  const frameMedianTimeToCorrect =
    Math.floor(median(characterAverageTimes) * 100) / 100;

  console.log("frameAverageTimeToCorrect", frameAverageTimeToCorrect);
  console.log("frameMedianTimeToCorrect", frameMedianTimeToCorrect);

  for (const character in perCharacterStats) {
    const stats = perCharacterStats[character];

    const ratioOfThisCharacterToFrameAverage =
      Math.floor(
        (perCharacterStats[character].averageTimeToCorrect /
          frameAverageTimeToCorrect) *
          100
      ) / 100;

    const ratioOfThisCharacterToFrameMedian =
      Math.floor(
        (perCharacterStats[character].averageTimeToCorrect /
          frameMedianTimeToCorrect) *
          100
      ) / 100;

    perCharacterStats[character].ratioOfAverageTimeToFrameAverage =
      ratioOfThisCharacterToFrameAverage;
    perCharacterStats[character].ratioOfAverageTimeToFrameMedian =
      ratioOfThisCharacterToFrameMedian;
  }

  // Calculate the variance
  const variance =
    characterAverageTimes.reduce(
      (acc, val) => acc + (val - frameAverageTimeToCorrect) ** 2,
      0
    ) / characterAverageTimes.length;

  const standardDeviation = Math.floor(Math.sqrt(variance) * 100) / 100;

  const topWongCharacters = getTopWrongCharacters(perCharacterStats);

  const frameAccuracy =
    Math.floor(
      (frame.charStats.filter((char) => char.state === "correct").length /
        frame.text.trim().split("").length) *
        10000
    ) / 100;

  return {
    perCharacterStats,
    standardDeviation,
    topWongCharacters,
    frameAverageTimeToCorrect,
    frameMedianTimeToCorrect,
    frameAccuracy,
  };
}

function getTopWrongCharacters(perCharacterStats: {
  [key: string]: ProcessedCharacterStats;
}) {
  const charStatArray = [];

  for (const [key, value] of Object.entries(perCharacterStats)) {
    if (value.accuracy < 100) {
      charStatArray.push({ char: key, ...value });
    }
  }

  return charStatArray
    .sort((a, b) => a.accuracy - b.accuracy)
    .map((char) => {
      return {
        char: char.char,
        accuracy: char.accuracy,
        count: char.count,
        correct: char.correct,
      };
    });
}

function median(values: number[]): number {
  // TODO: this is probably not the best guard
  if (!values.length) {
    return 0;
  }

  values = [...values].sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);

  return values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2;
}

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  console.log(values);
  console.log(values.reduce((acc, curr) => curr + acc, 0) / values.length);
  return values.reduce((acc, curr) => curr + acc, 0) / values.length;
}
