// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SERVER_API from "@/utils/server_api";

type ResponseData = {
  page: number;
  results: Item[];
  total_pages: number;
  total_results: number;
};

type Item = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;

  try {
    // TODO: paging, 정렬 같은 옵션 처리도 하기
    const response = await SERVER_API.get<ResponseData>("/discover/movie", {
      params: {
        with_genres: query.list_id,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).end();
  }
}
