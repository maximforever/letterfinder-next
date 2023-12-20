"use server";

const { MongoClient } = require("mongodb");
import { calculateWPM } from "./frameLogic";
import { generateFrameStats, generatePerCharacterStats } from "./frameSummary";
import { ProcessedCharacterStats } from "@/types";

const uri = "mongodb://localhost:27017/letterfixer";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(req: Request, res: Response) {
  console.log("HIT THE ROUTE AYYYYE!");
  if (req.method === "POST") {
    const body = await req.json();

    try {
      // Connect the client to the server
      await client.connect();
      // Establish and verify connection
      const db = await client.db("letterfixer");
      const framesCollection = await db.collection("frames");

      await framesCollection.insertOne({
        text: "testing",
        wpm: Math.floor(Math.random() * 200),
      });

      const frameStats = generateFrameStats(body);

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
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
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
