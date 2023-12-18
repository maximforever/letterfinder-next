"use server";

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/letterfixer";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function saveFrame() {
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
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
