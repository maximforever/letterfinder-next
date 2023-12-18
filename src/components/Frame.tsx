"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Word } from "./Word";
import {
  CharStats,
  CharStates,
  CompletedFrameStats,
  CompletedFrameResults,
} from "@/types";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const characters = ".,:;?!\"'";
const otherKeys = " ";
const allowedKeys = alphabet + characters + otherKeys;

export const Frame = ({ text }: { text: string }) => {
  const [characterIndex, _setCharacterIndex] = useState(0);
  const [chars, _setChars] = useState<CharStats[]>([]);
  const [complete, setComplete] = useState(false);
  const [completedFrameStats, setCompletedFrameStats] =
    useState<null | CompletedFrameStats>(null);

  const frameStartTime = useRef(null);
  const characterIndexRef = useRef(characterIndex);
  const charsRef = useRef(chars);

  // TODO: we do this because...?
  function setCurrentCharacterIndex(value) {
    characterIndexRef.current = value; // Updates the ref
    _setCharacterIndex(value);
  }

  function setChars(value: CharStats[]) {
    charsRef.current = value; // Updates the ref
    _setChars(value);
  }

  function saveFrame() {
    // TODO: why can't I access chars? Why do I need chars.current?
    const frameBody: CompletedFrameResults = {
      text: text,
      timeToComplete: Date.now() - frameStartTime.current,
      charStats: charsRef.current,
    };

    fetch("/api/frame", {
      method: "POST",
      body: JSON.stringify(frameBody),
    })
      .then((res) => res.json())
      .then((res) => {
        setCompletedFrameStats({
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
          startTime: null,
          timeToType: null,
          timeToTypeCorrectly: null,
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

      // we do updatedChars to make a whole bunch of immediate changes to the most up-to-date char stat info,
      // then update the state and ref with it

      const currentCharacterIndex = characterIndexRef.current;
      const updatedChars = charsRef.current;
      let timeToType: null | number = null;
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

        if (key === updatedChars[currentCharacterIndex].character) {
          // if we got the right key, then we're either correct or correcting
          newCharacterState =
            updatedChars[currentCharacterIndex].state === "incomplete"
              ? "correct"
              : "corrected";
        } else {
          newCharacterState = "incorrect";
        }

        if (currentCharacterIndex === 0) {
          // we don't track the first character
          frameStartTime.current = Date.now();
        } else {
          // if this isn't the first character...
          const updatedCharStartTime =
            updatedChars[currentCharacterIndex].startTime;
          const currentCharTimeToType =
            updatedChars[currentCharacterIndex].timeToType;
          const currentCharTimeToTypeCorrectly =
            updatedChars[currentCharacterIndex].timeToTypeCorrectly;

          // record the typing time
          if (currentCharTimeToType === null) {
            timeToType = Date.now() - updatedCharStartTime;
          }

          // record the correct typing time
          if (currentCharTimeToTypeCorrectly === null) {
            timeToTypeCorrectly = Date.now() - updatedCharStartTime;
          }
        }

        if (currentCharacterIndex < text.length) {
          setCurrentCharacterIndex(currentCharacterIndex + 1);
        }
      }

      updatedChars[currentCharacterIndex] = {
        ...updatedChars[currentCharacterIndex],
        state: newCharacterState,
        deleted: newCharacterDeleted,
        timeToType: timeToType,
        timeToTypeCorrectly: timeToTypeCorrectly,
        typed: key,
      };

      // if there's a next character that hasn't been started, its time starts now
      if (currentCharacterIndex + 1 < text.length) {
        if (updatedChars[currentCharacterIndex + 1].startTime === null) {
          updatedChars[currentCharacterIndex + 1].startTime === Date.now();
        }
      }

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
    if (completedFrameStats === null) {
      return;
    }

    return (
      <div className="border-2 border-green-500 mb-4 p-2 flex flex-col absolute bottom-12 min-w-[200px] rounded-lg">
        <h2 className="text-2xl bold pb-4 text-green-500 text-center">
          You got it!
        </h2>
        <p>Words typed: {completedFrameStats.textLength}</p>
        <p>time: {completedFrameStats.totalTime}</p>
        <p>WPM: {completedFrameStats.wpm}</p>
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
