import React from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import MediumContract from "../constants/contractABI/Medium.json";

const DisplayBlog = () => {
  const { token } = useMoralisWeb3Api();
  const { data: allNfts } = useMoralisWeb3ApiCall(
    token.getNFTOwners,
    {
      chain: "mumbai",
      address: MediumContract.address,
    },
    { autoFetch: true }
  );

  console.log(allNfts);
  return (
    <>
      {allNfts?.result?.map((nft, index) => (
        <div key={index}>
          <p>{nft.owner_of}</p>
          <p>{nft.token_uri}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayBlog;
