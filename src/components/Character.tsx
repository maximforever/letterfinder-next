"use client";
import { CharStates, CharStats } from "@/types";

type CharProps = {
  char: CharStats;
  currentCharacterIndex: number;
};

export const Character = ({ char, currentCharacterIndex }: CharProps) => {
  const renderCurrentCharacterIndicator = () => {
    if (char.index === currentCharacterIndex) {
      return (
        <div className="w-full bg-slate-700 absolute bottom-0 h-[3px] rounded-b-sm"></div>
      );
    }
  };

  const currentCharStyling = () => {
    const isCurrentChar = char.index === currentCharacterIndex;
    const isSpace = !char.character.trim().length;

    if (char.deleted || isCurrentChar) {
      return isSpace ? "bg-slate-100" : "bg-slate-200";
    } else if (char.state === "incorrect") {
      return "bg-red-200";
    } else if (char.state === "correct") {
      return "bg-green-200";
    } else if (char.state === "corrected") {
      return "bg-yellow-200";
    } else if (isSpace) {
      return "bg-slate-100";
    } else {
      return "bg-slate-200";
    }
  };

  return (
    <div
      className={`w-6 h-9 l:w-8 lg:h-12 m-1 relative text-base xl:text-lg rounded-sm flex justify-center items-center ${currentCharStyling()}`}
    >
      {char.character}
      {renderCurrentCharacterIndicator()}
    </div>
  );
};
