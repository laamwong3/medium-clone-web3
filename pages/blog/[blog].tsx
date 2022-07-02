import { Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import MediumContract from "../../constants/contractABI/Medium.json";

interface BlogTypes {
  title: string;
  content: string;
}

const Blog: NextPage = () => {
  const { query } = useRouter();

  // const [index, setIndex] = useState(0);
  const [blog, setBlog] = useState<BlogTypes>({ content: "", title: "" });
  const { token } = useMoralisWeb3Api();
  const { data: allNfts } = useMoralisWeb3ApiCall(
    token.getNFTOwners,
    {
      chain: "mumbai",
      address: MediumContract.address,
    },
    { autoFetch: true }
  );
  // console.log(index);
  useEffect(() => {
    if (allNfts?.result) {
      allNfts.result.map((nft) => {
        if (nft.token_uri?.split("/")[4] === query.blog && nft.metadata) {
          let { title, content }: BlogTypes = JSON.parse(nft.metadata);
          setBlog({ title: title, content: content });
        }
      });
    }
  }, [allNfts]);
  // console.log(allNfts);
  return (
    <>
      {blog && (
        <>
          <Typography
            component="h1"
            variant="h2"
            gutterBottom
            textAlign="center"
          >
            {blog.title}
          </Typography>
          <Typography component="h2" variant="body1" gutterBottom>
            {blog.content}
          </Typography>
        </>
      )}
    </>
  );
};

export default Blog;
