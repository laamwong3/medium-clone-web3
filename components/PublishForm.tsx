import React, { useState } from "react";
import { TextField, Stack, Button, Box } from "@mui/material";
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useNotification } from "web3uikit";
import mediumContract from "../constants/contractABI/Medium.json";
import { useStateAPI } from "../context/StateManager";

// interface PublishFormPropsType {
//   isUploading: boolean;
//   setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
// }

const PublishForm = () => {
  // console.log(MediumContract);
  const [input, setInput] = useState({
    title: "",
    content: "",
  });
  const { isUploadingToIpfs, setIsUploadingToIpfs } = useStateAPI();
  const { Moralis, account, isAuthenticated } = useMoralis();
  const { saveFile } = useMoralisFile();
  const { fetch: executeContractFunction } = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const uploadToIPFS = async () => {
    setIsUploadingToIpfs(true);
    if (input.title.trim() !== "" && input.content.trim() !== "") {
      const metadata = {
        title: input.title,
        content: input.content,
      };

      await saveFile(
        "myBlog.json",
        { base64: btoa(JSON.stringify(metadata)) },
        {
          type: "base64",
          saveIPFS: true,
          onSuccess: async (result) => {
            const metadataNFT = {
              description: input.title,
              //@ts-ignore
              externalUrl: result._ipfs,
            };

            await saveFile(
              "metadata.json",
              {
                base64: btoa(JSON.stringify(metadataNFT)),
              },
              {
                type: "base64",
                saveIPFS: true,
                onSuccess: async (finalResult) => {
                  //@ts-ignore
                  // console.log(finalResult._ipfs);
                  //@ts-ignore
                  await mint(account!, finalResult._ipfs);
                },
                onError: (error) => {
                  console.log(error);
                  setIsUploadingToIpfs(false);
                },
              }
            );
          },
          onError: (error) => {
            console.log(error);
            setIsUploadingToIpfs(false);
          },
        }
      );
    } else {
      dispatch({
        type: "error",
        position: "topR",
        message: "Input can't be empty",
        icon: "exclamation",
        title: "Error",
      });
      setIsUploadingToIpfs(false);
    }
  };

  const mint = async (mintTo: string, tokenUri: string) => {
    await executeContractFunction({
      params: {
        contractAddress: mediumContract.address,
        functionName: "safeMint",
        abi: mediumContract.abi,
        params: {
          _to: mintTo,
          _uri: tokenUri,
        },
        msgValue: Moralis.Units.ETH("0.01"),
      },
      onSuccess: async (result) => {
        console.log(result);

        //@ts-ignore
        // await result.wait(1);
        dispatch({
          type: "info",
          title: "Upload and mint NFT successfully",
          message: "Please verify on polygon scan",
          position: "topR",
          icon: "bell",
        });
        setIsUploadingToIpfs(false);
      },
      onError: (error) => {
        console.log(error);
        setIsUploadingToIpfs(false);
      },
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <Stack direction="column" gap={5}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Title"
          variant="outlined"
          onChange={handleChange}
          name="title"
        />
        <TextField
          fullWidth
          multiline
          minRows={20}
          maxRows={20}
          id="outlined-basic"
          label="Content"
          variant="outlined"
          onChange={handleChange}
          name="content"
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={!isAuthenticated || isUploadingToIpfs}
            variant="contained"
            onClick={uploadToIPFS}
          >
            PUBLISH
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default PublishForm;
