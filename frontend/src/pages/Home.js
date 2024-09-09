import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import Post from "../components/post";
import CommunityCarousel from "../components/CommunityCarousel";

function HomePage() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("/api/post");

      if (response.data.success) {
        setPosts(response.data.data.reverse());
      }
    };

    fetchPosts();
  }, []);
  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}> Top Communities </Typography>
      <CommunityCarousel />
      <Typography variant="h5" sx={{ mt: 4 }}> Latest Posts </Typography>
      <Grid container spacing={7} sx={{ mt: 2 }}>
        {posts?.map((post, index) => (
          <Grid item xs={20} key={index}>
            <Post post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;
