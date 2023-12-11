"use client";
import { useState } from "react";
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
    <div className="flex py-2 border-2 border-black whitespace-nowrap">
      {renderCharacters()}
    </div>
  );
};
