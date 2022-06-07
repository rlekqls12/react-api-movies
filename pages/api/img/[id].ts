// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const id = query.id;
  const size = query.size || "original";

  res.redirect("https://image.tmdb.org/t/p/" + size + "/" + id);
}
