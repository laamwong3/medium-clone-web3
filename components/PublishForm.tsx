import React, { useState } from "react";
import { TextField, Stack, Button, Box } from "@mui/material";
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useNotification } from "web3uikit";

interface IPFSDataType {
  __type: string;
  name: string;
  url: string;
  ipfs: string;
  hash: string;
}
interface PublishFormPropsType {
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublishForm = ({ isUploading, setIsUploading }: PublishFormPropsType) => {
  const [input, setInput] = useState({
    title: "",
    content: "",
  });

  const { Moralis, account, isAuthenticated } = useMoralis();
  const { saveFile } = useMoralisFile();
  const { fetch: executeContractFunction } = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const uploadToIPFS = async () => {
    setIsUploading(true);
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
            // const data = JSON.stringify(result, null, 2);
            // const final = JSON.parse(data);
            // console.log(final);
            // console.log(result);
            // console.log(result._url.split("/")[6]);
            //const hash = result._url.split("/")[6];
            // console.log(result._ipfs);
            // console.log(result);
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
                  //   console.log(finalResult);
                  //   setIsUploading(false);
                  //@ts-ignore
                  console.log(finalResult._ipfs);
                  await mint(account, finalResult._ipfs);

                  dispatch({
                    type: "info",
                    title: "Upload and mint NFT successfully",
                    //@ts-ignore
                    message: finalResult._ipfs,
                    position: "topR",
                    icon: "bell",
                  });
                },
                onError: (error) => {
                  console.log(error);
                  setIsUploading(false);
                },
              }
            );
          },
          onError: (error) => {
            console.log(error);
            setIsUploading(false);
          },
        }
      );
    } else {
      dispatch({
        type: "error",
        position: "topR",
        message: "Input cant be empty",
        icon: "exclamation",
        title: "Error",
      });
      setIsUploading(false);
    }
  };

  const mint = async (mintTo, tokenUri) => {
    await executeContractFunction({});
  };

  //   console.log(input);
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
          id="outlined-basic"
          label="Content"
          variant="outlined"
          onChange={handleChange}
          name="content"
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={!isAuthenticated || isUploading}
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
