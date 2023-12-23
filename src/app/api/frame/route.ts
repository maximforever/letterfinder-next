"use server";
import { calculateWPM } from "./frameLogic";
import { generateFrameStats, generatePerCharacterStats } from "./frameSummary";
import { saveFrame } from "@/app/db/saveFrame";

export async function POST(req: Request, res: Response) {
  console.log("HIT THE ROUTE AYYYYE!");
  if (req.method === "POST") {
    const body = await req.json();

    try {
      // TODO: figure out the types for incoming frame stats and processed frame stats
      // as well as the frame stats we send over
      const frameStats = generateFrameStats(body);
      await saveFrame(frameStats);

      return new Response(
        JSON.stringify({
          message: "Saved!",
          wpm: calculateWPM(body.text, body.timeToComplete),
          totalTime: body.timeToComplete,
          text: body.text,
          ...frameStats,
        }),
        {
          status: 200,
        }
      );
    } catch {
      return new Response(JSON.stringify({ message: "Something went wrong" }), {
        status: 500,
      });
    }
  } else {
    // Handle any non-POST requests
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }
}

export async function GET(req: Request, res: Response) {
  console.log("GOT A GET");

  return new Response(JSON.stringify({ message: "Got a GET" }), {
    status: 200,
  });
}
