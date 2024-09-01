import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { ThumbUp, Comment } from "@mui/icons-material";


<Card sx={{ maxWidth: "100%" }}>
<CardHeader
  avatar={
    <Avatar aria-label="recipe">
      {post.author.firstName[0] + post.author.lastName[0]}
    </Avatar>
  }
  
  subheader={`Posted by ${post.author.username}`}
  sx={{
    "& .MuiCardHeader-subheader": {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  }}
/>

<CardContent>
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
  >
    {post.content}
  </Typography>
</CardContent>

<CardActions disableSpacing sx={{ mt: "auto" }}>
  <IconButton aria-label="upvote">
    <ThumbUp />
  </IconButton>
  <IconButton aria-label="comment">
    <Comment />
  </IconButton>
</CardActions>
</Card>