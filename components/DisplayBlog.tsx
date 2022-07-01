import { useSwitch } from "@mui/base";
import React, { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import useSWR from "swr";
import MediumContract from "../constants/contractABI/Medium.json";
//import { BlogContentTypes } from "../pages/api/ipfs";
import axios from "axios";
import BlogCard from "./BlogCard";
import { Stack } from "@mui/material";

interface BlogsContentMetadataTypes {
  title: string;
  content: string;
}
interface BlogsContentTypes extends BlogsContentMetadataTypes {
  owner: string;
  url: string;
}
interface BlogsMetadataTypes {
  description: string;
  externalUrl: string;
}

interface BlogsTypes extends BlogsMetadataTypes {
  owner: string;
}

const DisplayBlog = () => {
  const [blogs, setBlogs] = useState<BlogsTypes[]>([]);
  const [blogsContent, setBlogsContent] = useState<BlogsContentTypes[]>([]);

  const { token } = useMoralisWeb3Api();
  const { data: allNfts, fetch: getNfts } = useMoralisWeb3ApiCall(
    token.getNFTOwners,
    {
      chain: "mumbai",
      address: MediumContract.address,
    },
    { autoFetch: true }
  );
  console.log(allNfts);
  // console.log(blogs);
  // console.log(blogsContent);

  // useEffect(() => {
  //   (() => {
  //     if (blogs && blogsContent.length === 0) {
  //       let content: BlogsContentTypes[] = [];
  //       blogs.map(async (blog) => {
  //         let { data } = await axios.get<BlogsContentMetadataTypes>(
  //           blog.externalUrl.replace(
  //             "https://ipfs.moralis.io:2053/ipfs/",
  //             // "https://ipfs.io/ipfs/"
  //             "https://gateway.moralisipfs.com/ipfs/"
  //           )
  //         );
  //         //console.log(data);
  //         let item: BlogsContentTypes = {
  //           content: data.content,
  //           title: data.title,
  //           owner: blog.owner,
  //           url: blog.externalUrl,
  //         };
  //         content.push(item);
  //       });
  //       setBlogsContent(content);
  //       // console.log(blogsContent);
  //     }
  //   })();
  // }, [blogs]);

  useEffect(() => {
    (() => {
      if (allNfts?.result) {
        let content: BlogsTypes[] = [];
        allNfts.result.map(async (nft) => {
          if (nft.metadata) {
            let { description, externalUrl }: BlogsMetadataTypes = JSON.parse(
              nft.metadata
            );
            let item: BlogsTypes = {
              description: description,
              externalUrl: externalUrl,
              owner: nft.owner_of,
            };

            content.push(item);
          }
        });
        setBlogs(content);
      }
    })();
  }, [allNfts]);

  return (
    <>
      <Stack direction="column" gap={3}>
        {blogs &&
          blogs.map((blog, index) => (
            <BlogCard
              key={index}
              owner={blog.owner}
              title={blog.externalUrl}
              content={blog.description}
              url={blog.externalUrl}
            />
          ))}
      </Stack>
    </>
  );
};

export default DisplayBlog;
