"use client";

type CharProps = {
  char: string;
  index: number;
  currentCharacterIndex: number;
};

export const Character = ({
  char,
  index,
  currentCharacterIndex,
}: CharProps) => {
  const currentCharStyling = () => {
    const isCurrentChar = index === currentCharacterIndex;
    return isCurrentChar ? "border-b-2 border-black " : "";
  };

  return (
    <div
      className={`w-8 py-4 m-2 rounded-sm bg-slate-200 text-center align-center ${currentCharStyling()}`}
    >
      {char}
    </div>
  );
};
