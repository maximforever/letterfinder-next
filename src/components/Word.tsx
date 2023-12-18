"use client";

import { Character } from "./Character";
import { CharStats } from "@/types";

type WordProps = {
  word: string;
  startingIndex: number;
  currentCharacterIndex: number;
  chars: CharStats[];
};

export const Word = ({
  word,
  startingIndex,
  currentCharacterIndex,
  chars,
}: WordProps) => {
  const renderCharacters = () => {
    // we're not using the character from this map because we need all the char stats (to render the chars properly)
    return word.split("").map((_, index) => {
      const thisChar = chars[startingIndex + index];
      return (
        <Character
          key={index}
          char={thisChar}
          currentCharacterIndex={currentCharacterIndex}
        />
      );
    });
  };

  return (
    <div className="flex py-2 whitespace-nowrap border-2 border-black">
      {renderCharacters()}
    </div>
  );
};
