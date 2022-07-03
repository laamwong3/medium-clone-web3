import { useSwitch } from "@mui/base";
import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import useSWR from "swr";
import MediumContract from "../constants/contractABI/Medium.json";
//import { BlogContentTypes } from "../pages/api/ipfs";
import axios from "axios";
// import BlogCard from "./BlogCard";
import { Stack, Typography } from "@mui/material";
import BlogCard from "../components/BlogCard";

interface BlogsMetadataTypes {
  title: string;
  content: string;
}

interface BlogsTypes extends BlogsMetadataTypes {
  owner: string;
  cid: string;
}

const DisplayBlog = () => {
  const [blogs, setBlogs] = useState<BlogsTypes[]>([]);
  // const [blogsContent, setBlogsContent] = useState<BlogsContentTypes[]>([]);
  const { account: userAddress, isAuthenticated } = useMoralis();
  const { account } = useMoralisWeb3Api();
  const { data: allNfts, fetch: getAllNfts } = useMoralisWeb3ApiCall(
    account.getNFTsForContract,
    {
      chain: "mumbai",
      address: userAddress!,
      token_address: MediumContract.address,
    }
  );
  // console.log(allNfts);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await getAllNfts();
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    (() => {
      if (allNfts?.result) {
        let contents: BlogsTypes[] = [];
        allNfts.result.map(async (nft) => {
          if (nft.metadata && nft.token_uri) {
            let { title, content }: BlogsMetadataTypes = JSON.parse(
              nft.metadata
            );
            let item: BlogsTypes = {
              title: title,
              content: content,
              owner: nft.owner_of,
              cid: nft.token_uri.split("/")[4],
            };
            contents.push(item);
          }
        });
        setBlogs(contents);
      }
    })();
  }, [allNfts]);

  return (
    <>
      <Stack direction="column" gap={3}>
        {blogs && isAuthenticated ? (
          blogs.map((blog, index) => (
            <BlogCard
              key={index}
              owner={blog.owner}
              title={blog.title}
              content={blog.content}
              cid={blog.cid}
            />
          ))
        ) : (
          <>
            <Typography variant="h2" component="div" textAlign="center">
              Please Connect Wallet
            </Typography>
          </>
        )}
      </Stack>
    </>
  );
};

export default DisplayBlog;
