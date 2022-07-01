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
  // const [isFetchingIpfs, setIsFetchingIpfs] = useState(false);
  const { token } = useMoralisWeb3Api();
  const { data: allNfts, fetch: getNfts } = useMoralisWeb3ApiCall(
    token.getNFTOwners,
    {
      chain: "mumbai",
      address: MediumContract.address,
    },
    { autoFetch: true }
  );
  console.log(blogs);
  console.log(blogsContent);
  //console.log(allNfts);

  // useEffect(() => {
  //   setBlogs([]);
  //   setBlogsContent([]);
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     setBlogsContent([]);
  //     blogs.map(async (blog) => {
  //       let { data: blogContent } = await axios.get<BlogsContentMetadataTypes>(
  //         blog.externalUrl.replace(
  //           "https://ipfs.moralis.io:2053/ipfs/",
  //           "https://ipfs.io/ipfs/"
  //           // "https://gateway.moralisipfs.com/ipfs/"
  //         )
  //       );
  //       setBlogsContent((prevState) => [
  //         ...prevState,
  //         {
  //           title: blogContent.title,
  //           content: blogContent.content,
  //           owner: blog.owner_of,
  //         },
  //       ]);
  //     });
  //   })();
  // }, [blogs]);

  useEffect(() => {}, [blogs]);
  //console.log(!blogs);
  useEffect(() => {
    (() => {
      setBlogs([]);
      //setBlogsContent([]);
      if (allNfts?.result) {
        allNfts.result.map(async (nft) => {
          if (nft.metadata) {
            let { description, externalUrl }: BlogsMetadataTypes = JSON.parse(
              nft.metadata
            );
            setBlogs((prevState) => [
              ...prevState,
              {
                description: description,
                externalUrl: externalUrl,
                owner: nft.owner_of,
              },
            ]);
            // let { data } = await axios.get<MetadataTypes>(nft.metadata);
            // setBlogs((prevState) => [
            //   ...prevState,
            //   { description: description, externalUrl: externalUrl },
            // ]);

            // let { data: blogContent } = await axios.get<BlogContentTypes>(
            //   externalUrl.replace(
            //     "https://ipfs.moralis.io:2053/ipfs/",
            //     "https://gateway.moralisipfs.com/ipfs/"
            //   )
            // );
            // setBlogsContent((prevState) => [
            //   ...prevState,
            //   { title: blogContent.title, content: blogContent.content },
            // ]);
          }
        });
      }
    })();
  }, [allNfts]);

  // useEffect(() => {
  //   // (async () => {
  //   //   await getNfts();
  //   // })();

  //   (async () => {
  //     if (allNfts?.result) {
  //       allNfts.result.map(async (nft) => {
  //         if (nft.metadata) {
  //           const { data: test } = await axios.get<MetadataTypes>(nft.metadata);
  //           console.log(test.description);
  //         }
  //         if (nft.token_uri) {
  //           let { data: metadata } = await axios.get<MetadataTypes>(
  //             nft.token_uri.replace(
  //               "https://ipfs.moralis.io:2053/ipfs/",
  //               "https://ipfs.io/ipfs/"
  //             )
  //           );
  //           // console.log(metadata);
  //           setBlogs((prevState) => [
  //             ...prevState,
  //             {
  //               description: metadata.description,
  //               externalUrl: metadata.externalUrl,
  //             },
  //           ]);

  //           let { data: blogContent } = await axios.get<BlogContentTypes>(
  //             metadata.externalUrl.replace(
  //               "https://ipfs.moralis.io:2053/ipfs/",
  //               "https://ipfs.io/ipfs/"
  //             )
  //           );

  //           setBlogsContent((prevState) => [
  //             ...prevState,
  //             { content: blogContent.content, title: blogContent.title },
  //           ]);
  //         }
  //       });
  //     }
  //   })();
  // }, [allNfts]);
  // console.log(blogContent);
  // useEffect(() => {
  //   (async () => {
  //     // setIsFetchingIpfs(true);

  //     //allNfts?.result?.splice(0, 1);
  //     if (allNfts?.result) {
  //       setBlogs([]);
  //       allNfts?.result?.map(async (nft) => {
  //         let url = nft.token_uri?.replace(
  //           "https://ipfs.moralis.io:2053/ipfs/",
  //           "https://ipfs.io/ipfs/"
  //         );
  //         console.log(url);
  //         if (url) {
  //           let { data: blog } = await axios.get<MetadataTypes>(url);
  //           // console.log(blog.externalUrl);

  //           let externalUrl = blog.externalUrl.replace(
  //             "https://ipfs.moralis.io:2053/ipfs/",
  //             "https://ipfs.io/ipfs/"
  //           );
  //           let { data: blogContent } = await axios.get<BlogContentTypes>(
  //             externalUrl
  //           );
  //           setBlogContent((prevState) => [...prevState, blogContent]);
  //         }
  //         // setIsFetchingIpfs(false);
  //       });
  //     }
  //     // const { data } = await axios.get<BlogContentTypes>();
  //   })();
  // }, [allNfts]);
  // (async () => {
  //   if (allNfts) {
  //     const { data } = await axios.get(
  //       "https://gateway.moralisipfs.com/ipfs/QmRdLhGu8Fbq6sbhuVLWXALwQAW6QeLyLN7oVdHieybCRN"
  //     );
  //     console.log(allNfts);
  //     console.log(data);
  //   }
  // })();
  // const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // const { data: imageData, mutate } = useSWR<Data[]>(
  //   `api/v2/${data}`,
  //   fetcher,
  //   {}
  // );
  // // console.log(allNfts);

  // const getBlogContent = (tokenUri: string) => {
  //   const fetcher = (url: string) => fetch(url).then((res) => res.json);
  //   const { data } = useSWR<BlogContentTypes>(
  //     `api/ipfs?uri=${tokenUri}`,
  //     fetcher
  //   );
  //   return data;
  // };
  // console.log(allNfts);
  // console.log(blogs);
  // useEffect(() => {
  //   (async () => {
  //     if (allNfts) {
  //       if (allNfts.result[0]) {

  //         const {} = await axios.get<BlogContentTypes>(
  //           allNfts.result[0].token_uri
  //         );
  //       }
  //     }

  //     // if (allNfts) {
  //     //   allNfts?.result?.map(async (nft) => {
  //     //     if (nft.token_uri) {
  //     //       const data = await axios.get<BlogContentTypes>(nft.token_uri);
  //     //       setBlogs((prevState) => [
  //     //         ...prevState,
  //     //         { title: data.data.title, content: data.data.content },
  //     //       ]);
  //     //     }
  //     //   });
  //     // }
  //   })();
  // }, [allNfts]);

  // const showContent = () =>
  //   blogs.map(async (blog, index) => (
  //     let {} = await axios.get(blog)
  //     <BlogCard
  //       key={index}
  //       title={blog.description}
  //       content={blog.externalUrl}
  //     />
  //   ));

  return (
    <>
      <Stack direction="column" gap={3}></Stack>
    </>
  );
};

export default DisplayBlog;
