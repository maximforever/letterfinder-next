"use client";
import { useState } from "react";
import { Character } from "./Character";

type WordProps = {
  word: string;
  startingWordIndex: number;
  currentCharacterIndex: number;
};

export const Word = ({
  word,
  startingWordIndex,
  currentCharacterIndex,
}: WordProps) => {
  const renderCharacters = () => {
    return word
      .split("")
      .map((char, index) => (
        <Character
          key={index}
          index={startingWordIndex + index}
          char={char}
          currentCharacterIndex={currentCharacterIndex}
        />
      ));
  };

  return (
    <div className="flex p-2 rounded-md border-2 border-black">
      {renderCharacters()}
    </div>
  );
};
