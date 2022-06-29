import { Box } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import DisplayBlog from "../components/DisplayBlog";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <>
      <DisplayBlog />
    </>
  );
};

export default Home;
