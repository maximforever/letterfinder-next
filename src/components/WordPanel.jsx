"use client";

import { Character } from "./Character";

export const WordPanel = () => {
  const breakTextIntoCharacters = () => {
    const text = "we run hard";
    return text
      .split("")
      .map((char, index) => <Character key={index} char={char} />);
  };

  return <div className="flex">{breakTextIntoCharacters()}</div>;
};
