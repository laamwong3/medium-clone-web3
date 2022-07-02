import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useRouter } from "next/router";

interface BlogContentTypes {
  title?: string;
  content?: string;
  owner?: string;
  cid?: string;
}

export default function BlogCard({
  title,
  content,
  owner,
  cid,
}: BlogContentTypes) {
  const router = useRouter();
  const displayBlog = () => {
    const hash = cid;
    router.push(`/blog/${hash}`);
  };
  return (
    <Card sx={{ maxWidth: "100%", height: 150, overflow: "scroll" }}>
      <CardActionArea onClick={displayBlog}>
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="div">
            {owner}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
