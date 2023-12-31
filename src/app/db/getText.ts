"use server";

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/letterfixer";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function getText() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    console.log("Connected successfully to server");

    const db = await client.db("letterfixer");
    const framesCollection = await db.collection("frames");
    const frames = await framesCollection.find({}).toArray();

    return frames[0].text.trim().toLowerCase();
  } catch {
    return "error";
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
