// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SERVER_API from "@/utils/server_api";

type ResponseData = {
  results: Item[];
  page: number;
  total_pages: number;
  total_results: number;
};

type Item = {
  id: number;
  adult?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const response = await SERVER_API.get<ResponseData>("/genre/movie/list");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).end();
  }
}
