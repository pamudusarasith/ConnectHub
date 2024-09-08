import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

function PostForm({ setOpen, post }) {
  const { name } = useParams();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [error, setError] = useState(null);
  console.log(post);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      name,
      title,
      content,
    };

    const response = await axios.post("/api/post", postData);

    if (response.status !== 200) {
      setError(response.error);
    }

    if (response.status === 200) {
      setTitle("");
      setContent("");
      setError(null);
      setOpen(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const postData = {
      name,
      title,
      content,
    };

    const response = await axios.patch('/api/post/' + post._id, postData);

    if (response.status !== 200) {
      setError(response.error);
    }

    if (response.status === 200) {
      setTitle("");
      setContent("");
      setError(null);
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="sm" sx={{p:2}}>
      <Box component="form" sx={{ mt: 3 }}>
        <Typography variant="h5">Create A New Post</Typography>

        <TextField
          sx={{ mb: 2 }}
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          sx={{ mb: 2 }}
          label="Content"
          fullWidth
          required
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={post ? handleUpdate : handleSubmit}
        >
          Submit Post
        </Button>
      </Box>
    </Container>
  );
}
export default PostForm;
