import { useSwitch } from "@mui/base";
import React, { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import useSWR from "swr";
import MediumContract from "../constants/contractABI/Medium.json";
//import { BlogContentTypes } from "../pages/api/ipfs";
import axios from "axios";

interface BlogContentTypes {
  title: string;
  content: string;
}
interface MetadataTypes {
  description: string;
  externalUrl: string;
}

const DisplayBlog = () => {
  const [blogs, setBlogs] = useState<MetadataTypes[]>([]);
  const { token } = useMoralisWeb3Api();
  const { data: allNfts } = useMoralisWeb3ApiCall(
    token.getNFTOwners,
    {
      chain: "mumbai",
      address: MediumContract.address,
    },
    { autoFetch: true }
  );
  console.log(blogs);
  useEffect(() => {
    (() => {
      setBlogs([]);
      //allNfts?.result?.splice(0, 1);
      allNfts?.result?.map(async (nft) => {
        let url = nft.token_uri?.replace(
          "https://ipfs.moralis.io:2053/ipfs/",
          "https://ipfs.io/ipfs/"
        );
        console.log(url);
        if (url) {
          let { data } = await axios.get<MetadataTypes>(url);
          console.log(data.description);
          setBlogs((prevState) => [...prevState, data]);
        }
      });
      // const { data } = await axios.get<BlogContentTypes>();
    })();
  }, [allNfts]);
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
  return (
    <>
      {allNfts?.result?.map((nft, index) => (
        <div key={index}>
          {/* {const {} = await axios.ge} */}
          <p>{nft.owner_of}</p>
          <p>{nft.token_uri}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayBlog;
