import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import { ThumbUp, Comment as CommentICON } from "@mui/icons-material";

function Post({ post }) {
  const [liked, setLiked] = useState(false);

  const handelLike = () => {
    setLiked(!liked);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ maxWidth: "100%",borderRadius:"8px"}} raised>
      <CardHeader
        avatar={
          <Stack direction="row" alignItems={"center"} spacing={4}>
            <Avatar aria-label="recipe" sx={{bgcolor:"#424242"}}>
              {post?.author.firstName[0] + post?.author.lastName[0]}
            </Avatar>
            <Typography>{post?.author.username}</Typography>
            <Typography variant="subtitle2">
              {formatDate(post?.createdAt)}
            </Typography>
          </Stack>
        }
      />
      <Link component={NavLink} to={"/post/" + post?._id} underline="none">
        <Typography variant="h5" align="left" margin={2}>
          {post?.title}
        </Typography>
      </Link>
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          align="left"
          sx={{ wordWrap: "break-word" }}
        >
          {post?.content}
        </Typography>
      </CardContent>

      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <IconButton
          aria-label="upvote"
          onClick={handelLike}
          color={liked ? "secondary" : "primary"}
        >
          <ThumbUp />
        </IconButton>
        <Link
          component={NavLink}
          to={"/post/" + post?._id + "?action=comment"}
          underline="none"
        >
          <IconButton aria-label="comment">
            <CommentICON />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
}

export default Post;
