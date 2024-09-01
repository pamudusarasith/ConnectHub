import {
  Container,
  Box,
  Typography,
  Grid2 as Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RoundButton, RoundButtonOutlined } from "../components/common.js";
import { AddRounded, MoreHorizRounded } from "@mui/icons-material";
import { LoginStateCtx } from "../Contexts";

function CommunityPage() {
  const { isLoggedIn } = useContext(LoginStateCtx);
  const { name } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get(`/api/community/${name}`).then((res) => {
      if (res.data.success) setData(res.data.data);
    });
  }, [name]);

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
            <Typography variant="h4">{data.community?.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              {data.community?.description}
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <RoundButtonOutlined>
                <AddRounded />
                <Typography variant="button">Post</Typography>
              </RoundButtonOutlined>
              {data.isMember ? (
                <RoundButtonOutlined onClick={handleLeave}>
                  <Typography variant="button">Leave</Typography>
                </RoundButtonOutlined>
              ) : (
                <RoundButton onClick={handleJoin}>
                  <Typography variant="button">Join</Typography>
                </RoundButton>
              )}

              <RoundButtonOutlined>
                <MoreHorizRounded />
              </RoundButtonOutlined>
            </Stack>
          </Box>
        </Grid>

        <Grid size={12}>
          <Typography variant="h6" component="h2">
            Recent Posts
          </Typography>
        </Grid>
        <Grid size={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Post Title 1"
                  secondary="This is a short description of the post. It gives an overview of the post content."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Post Title 2"
                  secondary="This is another short description of the post. It gives an overview of the post content."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CommunityPage;
