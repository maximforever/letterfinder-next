"use client";

import { useState, useEffect } from "react";
import { Word } from "./Word";
import { CharStats } from "@/types";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const characters = ".,:;?!\"'";
const otherKeys = " ";
const allowedKeys = alphabet + characters + otherKeys;

export const Frame = ({ text }) => {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [charsInOrder, setCharsInOrder] = useState([]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyDown(e.key));
  }, []);

  useEffect(() => {
    const updatedCharsInOrder: CharStats[] = text
      .split("")
      .map((char, index) => {
        return { char, index, state: "incomplete", timeToCorrect: null };
      });

    setCharsInOrder(updatedCharsInOrder);
  }, [text]);

  const isValidKey = (key) => {
    return allowedKeys.includes(key.toLowerCase());
  };

  const handleKeyDown = (key) => {
    if (!isValidKey(key)) {
      console.log("invalid letter " + key);
      return;
    }
    console.log(key);
  };

  const breakTextIntoWords = () => {
    const words = text.split(" ");
    const wordCount = words.length;
    let startingWordIndex = 0;

    return words.map((word: string, index: number) => {
      const separator = index === wordCount - 1 ? "" : " ";
      const thisWord = word + separator;
      const thisWordIndex = startingWordIndex;
      startingWordIndex += thisWord.length; // 1 is the separator length

      return (
        <Word
          key={index}
          word={thisWord}
          startingWordIndex={thisWordIndex}
          currentCharacterIndex={currentCharacterIndex}
        />
      );
    });
  };

  return <div className="flex m-4 p-4 border">{breakTextIntoWords()}</div>;
};
