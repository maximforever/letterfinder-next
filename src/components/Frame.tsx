"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Word } from "./Word";
import { CharStats } from "@/types";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const characters = ".,:;?!\"'";
const otherKeys = " ";
const allowedKeys = alphabet + characters + otherKeys;

export const Frame = ({ text }) => {
  const [characterIndex, _setCharacterIndex] = useState(0);
  const [chars, _setChars] = useState<CharStats[]>([]);

  const characterIndexRef = useRef(characterIndex);
  const charsRef = useRef(chars);

  function setCurrentCharacterIndex(value) {
    characterIndexRef.current = value; // Updates the ref
    _setCharacterIndex(value);
  }

  function setChars(value) {
    charsRef.current = value; // Updates the ref
    _setChars(value);
  }

  // break text up into characters and save them to chars
  useEffect(() => {
    const updatedChars: CharStats[] = text.split("").map((character, index) => {
      return {
        character,
        typed: null,
        index,
        state: "incomplete",
        timeToCorrect: null,
      };
    });

    setChars(updatedChars);
  }, [text]);

  //once chars are in state, listen for keydown
  useEffect(() => {
    window.addEventListener("keydown", (e) => handleTyping(e.key));
  }, []);

  const isValidKey = (key: string) => {
    return allowedKeys.includes(key.toLowerCase()) || key === "Backspace";
  };

  const handleTyping = useCallback(
    (key: string) => {
      if (!isValidKey(key)) {
        return;
      }

      const currentCharacterIndex = characterIndexRef.current;
      const currentChars = charsRef.current;

      let newCharacterState;
      let newCharacterDeleted;

      if (key === "Backspace") {
        newCharacterDeleted = true;
        if (currentCharacterIndex > 0) {
          setCurrentCharacterIndex(currentCharacterIndex - 1);
        }
      } else {
        if (key === currentChars[currentCharacterIndex].character) {
          const currentCharState = currentChars[currentCharacterIndex].state;
          const charCorrectedOrIncorrect = ["incorrect", "corrected"].includes(
            currentChars[currentCharacterIndex].state
          );
          newCharacterState = charCorrectedOrIncorrect
            ? "corrected"
            : "correct";
        } else {
          newCharacterState = "incorrect";
        }

        if (currentCharacterIndex + 1 <= text.length) {
          setCurrentCharacterIndex(currentCharacterIndex + 1);
        }
      }

      const updatedChars = [...currentChars];
      updatedChars[currentCharacterIndex] = {
        ...updatedChars[currentCharacterIndex],
        state: newCharacterState,
        deleted: newCharacterDeleted,
      };

      setChars(updatedChars);
    },
    [chars]
  );

  const breakTextIntoWords = () => {
    if (!chars.length) {
      return;
    }

    const words = text.match(/\w+[ .,?!:;]/g);
    let charIndex = 0;

    return words.map((word: string, index: number) => {
      const charIndexForThisWord = charIndex;
      charIndex += word.length;

      return (
        <Word
          key={index}
          word={word}
          chars={chars}
          startingIndex={charIndexForThisWord}
          currentCharacterIndex={characterIndex}
        />
      );
    });
  };

  return (
    <div className="flex  max-w-[90%] lg:max-w-screen-lg flex-wrap m-4 p-4 border">
      {breakTextIntoWords()}
    </div>
  );
};
