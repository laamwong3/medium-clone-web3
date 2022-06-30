// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type BlogContentTypes = {
  title: string;
  content: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogContentTypes>
) {
  // console.log(req.query.a);
  // res.status(200).json({ title: "a", content: "b" });
  (() => {
    fetch(``)
      //.then(async (response) => res.status(200).json(await response.json()))
      .then((response) => response.json())
      .then((data) => res.status(200).json(data))
      .catch((e) => console.log(e));
  })();
}
