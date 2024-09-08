import React from "react";
import { Container, Grid } from "@mui/material";

import Post from "./Post.js";

const Post1 = ({ posts }) => {
  console.log(posts)
  return (
    <Container maxWidth="md">
      <Grid container spacing={20}>
        {posts?.map((post, index) => (
          <Grid item xs={20} key={index}>
            <Post post={post}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Post1;
