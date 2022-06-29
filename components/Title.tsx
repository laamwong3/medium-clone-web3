import React, { useState } from "react";
import { Typography } from "@mui/material";

interface TitleProps {
  pathname: string;
}

const Title = ({ pathname }: TitleProps) => {
  let title = "";
  switch (pathname) {
    case "/":
      title = "Recommended Blog";
      break;
    case "/myblog":
      title = "My Blog";
      break;
    case "/publish":
      title = "Publish";
      break;
    default:
      title = "Blog Details";
  }

  return (
    <Typography
      textAlign="center"
      variant="h6"
      component="div"
      noWrap
      sx={{ flex: 1 }}
    >
      {title}
    </Typography>
  );
};

export default Title;
