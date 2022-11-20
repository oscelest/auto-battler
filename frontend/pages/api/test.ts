import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Process a POST request
  }
  else {
    // Handle any other HTTP method
  }
  res.end("Hello World");
}
