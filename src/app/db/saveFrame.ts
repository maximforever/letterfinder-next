"use server";

const { MongoClient } = require("mongodb");
import { ProcessedCharacterStats } from "@/types";

const uri = "mongodb://localhost:27017/letterfixer";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

type ProcessedFrameStat = {
  perCharacterStats: {
    [key: string]: ProcessedCharacterStats;
  };
  standardDeviation: number;
  topWrongCharacters: {
    char: string;
    accuracy: number;
    count: number;
    correct: number;
  }[];
  topSlowestCharacters: {
    char: string;
    accuracy: number;
    count: number;
    correct: number;
    averageTimeToCorrect: number;
  }[];
  frameAverageTimeToCorrect: number;
  frameMedianTimeToCorrect: number;
  frameAccuracy: number;
};

export async function saveFrame(stats: ProcessedFrameStat) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const db = await client.db("letterfixer");
    const framesCollection = await db.collection("frames");

    await framesCollection.insertOne(stats);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
