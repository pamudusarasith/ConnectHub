import {
  Container,
  Box,
  Typography,
  Grid2 as Grid,
  Stack,
  Dialog,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RoundButton } from "../components/common.js";
import { AddRounded } from "@mui/icons-material";
import { LoginStateCtx } from "../Contexts";
import CommunityMenuBtn from "../components/CommunityMenuBtn.js";
import PostForm from "../components/PostForm.js";
import Post from "../components/post.js";
import CommunityCarousel from "../components/CommunityCarousel";

function CommunityPage() {
  const { isLoggedIn } = useContext(LoginStateCtx);
  const { name } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [openPost, setOpenPost] = useState(false);

  useEffect(() => {
    axios.get(`/api/community/${name}`).then((res) => {
      if (res.data.success) setData(res.data.data);
    });
  }, [name]);

  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(`/api/post/community/${name}`);

      if (response.status === 200) {
        setPosts(response.data.reverse());
      }
    };

    fetchPosts();
  }, []);

  const handleJoin = () => {
    if (!isLoggedIn) return navigate("/login");
    axios.post(`/api/community/${name}/join`).then((res) => {
      if (res.data.success) setData({ ...data, isMember: true });
    });
  };

  const handleLeave = () => {
    axios.post(`/api/community/${name}/leave`).then((res) => {
      if (res.data.success) setData({ ...data, isMember: false });
    });
  };

  return (
    <>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid size={12}>
            <Box
              sx={{
                mt: 4,
                mb: 4,
                p: 2,
                backgroundColor: "primary.light",
                borderRadius: 2,
              }}
            >
              <Typography variant="h4">{data.name}</Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {data.description}
              </Typography>
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                {data.isMember ? (
                  <>
                    <RoundButton
                      variant="outlined"
                      onClick={() => setOpenPost(true)}
                    >
                      <AddRounded />
                      <Typography variant="button">Post</Typography>
                    </RoundButton>
                    <RoundButton variant="outlined" onClick={handleLeave}>
                      <Typography variant="button">Leave</Typography>
                    </RoundButton>
                    {data.isOwner && <CommunityMenuBtn data={data} />}
                  </>
                ) : (
                  <RoundButton onClick={handleJoin}>
                    <Typography variant="button">Join</Typography>
                  </RoundButton>
                )}
              </Stack>
              <Box sx={{ mt: 2, display: "flex" }}>
                {data?.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{ mr: 1, mb: 1, backgroundColor: "primary.main" }}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Dialog open={openPost} onClose={() => setOpenPost(false)}>
                <PostForm setOpen={setOpenPost} />
              </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={7} sx={{ mt: 2 }}>
          {posts?.map((post, index) => (
            <Grid item xs={20} key={index} sx={{ width: "100%" }}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default CommunityPage;
