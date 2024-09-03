import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";

function PostForm() {
  const [threadId, setThreadId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      threadId,
      title,
      content,
      author
    };

    const response = await fetch("api/post", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setThreadId("");
      setTitle("");
      setContent("");
      setAuthor("");
      setError(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" sx={{ mt: 3 }}>
        <Typography variant="h5">Create A New Post</Typography>

        <TextField
          sx={{ mb: 2 }}
          label="ThreadId"
          fullWidth
          required
          value={threadId}
          onChange={(e) => setThreadId(e.target.value)}
        />
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
        <TextField
          sx={{ mb: 2 }}
          label="Author"
          fullWidth
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
        >
          Submit Post
        </Button>
      </Box>
    </Container>
  );
}
export default PostForm;
