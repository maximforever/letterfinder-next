"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Word } from "./Word";
import { CharStats, CharStates, FrameStats } from "@/types";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const characters = ".,:;?!\"'";
const otherKeys = " ";
const allowedKeys = alphabet + characters + otherKeys;

export const Frame = ({ text }: { text: string }) => {
  const [characterIndex, _setCharacterIndex] = useState(0);
  const [chars, _setChars] = useState<CharStats[]>([]);
  const [complete, setComplete] = useState(false);
  const [frameStats, setFrameStats] = useState<null | FrameStats>(null);

  const startTime = useRef(null);
  const lastTimeTyped = useRef(null);
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

  function saveFrame() {
    // TODO: why can't I access chars? Why do I need chars.current?
    const frameBody = {
      text: text,
      timeToComplete: Date.now() - startTime.current,
      charStats: charsRef.current,
    };

    fetch("/api/frame", {
      method: "POST",
      body: JSON.stringify(frameBody),
    })
      .then((res) => res.json())
      .then((res) => {
        setFrameStats({
          wpm: res.wpm,
          textLength: res.textLength,
          totalTime: res.totalTime,
          text: res.text,
        });
      });
  }

  // break text up into characters and save them to chars
  useEffect(() => {
    // TODO: fix this
    if (text === undefined) {
      return;
    }

    const updatedChars: CharStats[] = text
      .replace(/\n/, "")
      .replace(/\s+/g, " ")
      .split("")
      .map((character, index) => {
        return {
          character,
          isFirstCharacter: index === 0,
          typed: null,
          deleted: false,
          index,
          state: "incomplete",
          timeToCorrect: null,
        };
      });

    setChars(updatedChars);
  }, [text]);

  //once chars are in state, listen for keydown
  useEffect(() => {
    if (!complete) {
      window.addEventListener("keydown", handleTyping);
    } else {
      return window.removeEventListener("keydown", handleTyping);
    }
    return () => {
      return window.removeEventListener("keydown", handleTyping);
    };
  }, [complete]);

  useEffect(() => {
    if (characterIndex === text.length) {
      setComplete(true);
      saveFrame();
    }
  }, [characterIndex]);

  const isValidKey = (key: string) => {
    return allowedKeys.includes(key.toLowerCase()) || key === "Backspace";
  };

  const handleTyping = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;

      if (!isValidKey(key) || complete) {
        return;
      }

      const currentCharacterIndex = characterIndexRef.current;
      const currentChars = charsRef.current;
      let timeToTypeCorrectly: null | number = null;

      let newCharacterState: CharStates;
      let newCharacterDeleted = false;

      if (key === "Backspace") {
        newCharacterDeleted = true;
        if (currentCharacterIndex > 0) {
          setCurrentCharacterIndex(currentCharacterIndex - 1);
        }
      } else {
        if (currentCharacterIndex >= text.length) {
          return;
        }

        if (key === currentChars[currentCharacterIndex].character) {
          const charCorrectedOrIncorrect = ["incorrect", "corrected"].includes(
            currentChars[currentCharacterIndex].state
          );
          newCharacterState = charCorrectedOrIncorrect
            ? "corrected"
            : "correct";
        } else {
          newCharacterState = "incorrect";
        }

        if (currentCharacterIndex === 0) {
          startTime.current = Date.now();
        } else {
          timeToTypeCorrectly = Date.now() - lastTimeTyped.current;
        }

        if (
          charsRef.current[currentCharacterIndex].timeToCorrect === null ||
          newCharacterState === "corrected"
        ) {
          lastTimeTyped.current = Date.now();
        }

        if (currentCharacterIndex < text.length) {
          setCurrentCharacterIndex(currentCharacterIndex + 1);
        }
      }

      const updatedChars = [...currentChars];
      updatedChars[currentCharacterIndex] = {
        ...updatedChars[currentCharacterIndex],
        state: newCharacterState,
        deleted: newCharacterDeleted,
        timeToCorrect: timeToTypeCorrectly,
        typed: key,
      };

      setChars(updatedChars);
    },
    [chars]
  );

  const breakTextIntoWords = () => {
    const words = text.match(/[\w'"-()]+[ .,?!:;]*/g);

    if (!chars.length || words === null) {
      return;
    }

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

  const renderCompleteScreen = () => {
    if (frameStats === null) {
      return;
    }

    return (
      <div className="border-2 border-green-500 mb-4 p-2 flex flex-col absolute bottom-12 min-w-[200px] rounded-lg">
        <h2 className="text-2xl bold pb-4 text-green-500 text-center">
          You got it!
        </h2>
        <p>Words typed: {frameStats.textLength}</p>
        <p>time: {frameStats.totalTime}</p>
        <p>WPM: {frameStats.wpm}</p>
      </div>
    );
  };

  return (
    <>
      <div className="flex  max-w-[90%] lg:max-w-screen-lg flex-wrap m-4 p-4 border">
        {breakTextIntoWords()}
      </div>
      {complete && renderCompleteScreen()}
    </>
  );
};
