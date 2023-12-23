import { getSampleSentence } from "@/app/api/text/getText";

export async function GET(req: Request, res: Response) {
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        text: getSampleSentence(),
      }),
      {
        status: 200,
      }
    );
  } else {
    // Handle any non-POST requests
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }
}
