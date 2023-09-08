"use client";

export const Character = ({ char }) => {
  const doSomething = () => {
    console.log("you clicked");
  };

  return (
    <div
      className="w-8 rounded-md py-4 m-2 bg-slate-200 text-center align-center"
      onClick={() => doSomething()}
    >
      {char}
    </div>
  );
};
