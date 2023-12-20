export function calculateWPM(text: string, timeToCompleteInMs: number) {
  const wordCount = text.split(" ").length;
  const wpm = Math.floor(wordCount * (60000 / timeToCompleteInMs) * 10) / 10;
  return wpm;
}
