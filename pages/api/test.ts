// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SERVER_API from "@/utils/server_api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await SERVER_API.get("/configuration");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).end();
  }
}
