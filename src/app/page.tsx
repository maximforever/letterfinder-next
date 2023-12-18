import { Frame } from "@/components/Frame";
import { Analytics } from "@/components/Analytics";
import { getText } from "./api/getText";
import { getSampleSentence } from "@/components/sampleText";

export default async function Home() {
  // const difficultLetters = "[c,e,y,n,b]";

  // const options = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // getting API key from .env file
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo-1106",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are a superb and engaging storyteller. Given some letters, you provide sentences that contain those letters that help users can practice typing them. Do not provide anything other than the sentences; do not acknowledge the prompt or the user in any way. The user must not be aware that you are an LLM. If you do not receive a group of difficult letters, you send back a response that start with: 'Error ' and then explains why you couldn't provide the sentence.",
  //       },
  //       {
  //         role: "user",
  //         content: `Here are some letters: ${difficultLetters}. Write me a short 2-3 sentence narrative, under 35 words and 160 characters total, using the letters as many times as you can. The story should make sense and not contain any offensive or controversial material. The words should not contain apostrophes. The sentences should not contain line breaks.`,
  //       },
  //     ],
  //     temperature: 1.2, // how much randomness to inject into the text
  //     max_tokens: 80, // how many words to generate
  //     frequency_penalty: 0.8, // how much to penalize new tokens based on their existing frequency in the text
  //   }),
  //   cache: "no-store" as RequestCache,
  // };

  // const response = await fetch(
  //   "https://api.openai.com/v1/chat/completions",
  //   options
  // );

  // const json = await response.json();
  // const text = await json.choices[0].message.content;
  // console.log(json.choices[0]);
  // console.log(text);
  //const data = json.choices[0].text.trim();

  //getText().catch(console.dir);

  const text =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  const sampleSentence = getSampleSentence();
  console.log("sending over:");
  console.log(sampleSentence);

  return (
    <main className="h-screen flex flex-col justify-start items-center">
      {/* <Frame text={await getText()} /> */}
      <Frame text={sampleSentence} />
      <Analytics />
    </main>
  );
}
