"use client";

import Link from "next/link";
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

export const Frame = ({}: {}) => {
  const [text, setText] = useState(null);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [chars, setChars] = useState<CharStats[]>([]);
  const [complete, setComplete] = useState(false);
  const [completedFrameStats, setCompletedFrameStats] =
    useState<null | CompletedFrameStats>(null);

  const frameStartTime = useRef(null);
  const textDivRef = useRef(null);

  function saveFrame() {
    const frameBody: CompletedFrameResults = {
      text: text,
      timeToComplete: Date.now() - frameStartTime.current,
      charStats: chars,
    };

    fetch("/api/frame", {
      method: "POST",
      body: JSON.stringify(frameBody),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCompletedFrameStats({
          wpm: res.wpm,
          textLength: res.textLength,
          totalTime: res.totalTime,
          text: res.text,
          frameAccuracy: res.frameAccuracy,
        });
      });
  }

  function fetchNewText() {
    fetch("/api/text", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ text }) => {
        resetFrameWithNewText();
        setText(text);
      });
  }

  function resetFrameWithNewText() {
    setCharacterIndex(0);
    setChars([]);
    setComplete(false);
    setCompletedFrameStats(null);
    frameStartTime.current = null;
  }

  useEffect(() => {
    fetchNewText();
  }, []);

  useEffect(() => {
    if (textDivRef === null || textDivRef.current === null) {
      return;
    }
    textDivRef.current.focus();
  }, [text]);

  // break text up into characters and save them to chars
  useEffect(() => {
    // TODO: fix this
    if (text === undefined || text === null) {
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

  useEffect(() => {
    if (text === undefined || text === null) {
      return;
    }

    if (characterIndex === text.length) {
      setComplete(true);
      saveFrame();
    }
  }, [characterIndex]);

  const isValidKey = (key: string) => {
    return allowedKeys.includes(key.toLowerCase()) || key === "Backspace";
  };

  const handleTyping = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key;

      if (!isValidKey(key) || complete) {
        return;
      }

      // we do updatedChars to make a whole bunch of immediate changes to the most up-to-date char stat info,
      // then update the state and ref with it

      const updatedChars = chars;
      let timeToType: null | number = null;
      let timeToTypeCorrectly: null | number = null;
      let typedKey: null | string = null;

      let newCharacterState: CharStates = chars[characterIndex].state;

      if (key === "Backspace") {
        if (characterIndex > 0) {
          updatedChars[characterIndex - 1].deleted = true;
          setCharacterIndex(characterIndex - 1);
        }
      } else {
        if (characterIndex >= text.length) {
          return;
        }

        typedKey = key;

        if (key === updatedChars[characterIndex].character) {
          // if we got the right key, then we're either correct or correcting
          newCharacterState = ["incomplete", "correct"].includes(
            updatedChars[characterIndex].state
          )
            ? "correct"
            : "corrected";
        } else {
          newCharacterState = "incorrect";
        }

        if (characterIndex === 0) {
          // we don't track the first character
          frameStartTime.current = Date.now();
        } else {
          // if this isn't the first character...
          const updatedCharStartTime = updatedChars[characterIndex].startTime;
          const currentCharTimeToType = updatedChars[characterIndex].timeToType;
          const currentCharTimeToTypeCorrectly =
            updatedChars[characterIndex].timeToTypeCorrectly;

          // record the typing time
          if (currentCharTimeToType === null) {
            timeToType = Date.now() - updatedCharStartTime;
          }

          // record the correct typing time
          if (currentCharTimeToTypeCorrectly === null) {
            timeToTypeCorrectly = Date.now() - updatedCharStartTime;
          }
        }

        if (characterIndex < text.length) {
          setCharacterIndex(characterIndex + 1);
        }
      }

      updatedChars[characterIndex] = {
        ...updatedChars[characterIndex],
        state: newCharacterState,
        timeToType: timeToType,
        timeToTypeCorrectly: timeToTypeCorrectly,
        typed: typedKey,
      };

      // if there's a next character that hasn't been started, its time starts now
      if (characterIndex + 1 < text.length) {
        if (updatedChars[characterIndex + 1].startTime === null) {
          updatedChars[characterIndex + 1].startTime = Date.now();
        }
      }

      setChars(updatedChars);
    },
    [chars, text, characterIndex, complete]
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
      <div className="absolute bottom-12 min-w-[200px]">
        <div className="border-2 border-green-500 mb-4 p-2 flex flex-col  rounded-lg">
          <h2 className="text-2xl bold pb-4 text-green-500 text-center">
            You got it!
          </h2>
          <p>Words typed: {completedFrameStats.text.split(" ").length}</p>
          <p>
            time:{" "}
            {Math.floor((completedFrameStats.totalTime / 1000) * 100) / 100}
          </p>
          <p>WPM: {completedFrameStats.wpm}</p>
          <p>Accuracy: {completedFrameStats.frameAccuracy}</p>
        </div>
        <button
          className="bg-green-500 text-white font-semibold px-4 py-1 rounded-lg"
          onClick={fetchNewText}
        >
          Next →
        </button>
      </div>
    );
  };

  return text === null ? (
    "Loading..."
  ) : (
    <div
      ref={textDivRef}
      autoFocus
      tabIndex={0}
      onKeyDown={handleTyping}
      className="focus:outline-none"
    >
      <div className="flex  max-w-[90%] lg:max-w-screen-lg flex-wrap m-4 p-4 border">
        {breakTextIntoWords()}
      </div>
      {complete && renderCompleteScreen()}
    </div>
  );
};
