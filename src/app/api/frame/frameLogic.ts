export function calculateWPM(text: string, timeToCompleteInMs: number) {
  console.log("text", text);
  console.log("timeToCompleteInMs", timeToCompleteInMs);

  const wordCount = text.split(" ").length;
  const wpm = Math.floor(wordCount * (60000 / timeToCompleteInMs) * 10) / 10;
  console.log("wpm", wpm);
  return wpm;
}
