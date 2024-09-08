import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow } from "date-fns";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";

function Comment({ openComment, setOpenComment }) {
  const [text, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comments/" + id);
      setComments(response.data.data.reverse());
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(id);
    const commentData = {
      postId: id,
      text,
    };

    if (text.trim()) {
      try {
        let response;
        if (editingCommentId) {
          response = await axios.put(
            `/api/comments/${editingCommentId}`,
            commentData
          );
        } else {
          response = await axios.post("/api/comments", commentData);
        }

        if (response.status === 200) {
          const result = response.data.data;
          if (!response.data.success && response.data.code === 401) {
            navigate("/login");
          }
          console.log("Comment saved:", result);

          fetchComments();

          setComment("");

          setEditingCommentId(null);

          textareaRef.current.style.height = "40px";
        } else {
          console.error("Failed to save the text");
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log("Comment cannot be empty");
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/api/comments/${commentId}`, {});

      if (response.status === 200) {
        console.log("Comment deleted");
        setComments(comments.filter((text) => text._id !== commentId));
      } else {
        console.error("Failed to delete text");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (id, text) => {
    setOpenComment(!openComment);
    setEditingCommentId(id);
    setComment(text);
    textareaRef.current.focus();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <h2>Comments</h2>
          <div
            style={{
              display: openComment ? "block" : "none",
              marginBlockEnd: "8px",
            }}
          >
            <TextField
              variant="outlined"
              multiline
              rows={1}
              value={text}
              onChange={handleChange}
              placeholder="Write a text"
              style={{ width: "80%", marginRight: "8px" }}
              ref={textareaRef}
            />

            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          </div>
        </label>
      </form>

      <div>
        {comments.map((text) => (
          <div
            key={text._id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              margin: "10px 0",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
              wordBreak: "break-word",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar src="/broken-image.jpg" />
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {text.author.username}
              </span>
              {text.createdAt && (
                <span style={{ marginLeft: "10px", color: "#888" }}>
                  {formatDistanceToNow(new Date(text.createdAt))} ago
                </span>
              )}
              {text.edited && <span>(edited)</span>}
            </div>
            <pre
              style={{
                flex: 1,
                margin: 0,
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              {text.text}
            </pre>
            <div>
              <IconButton onClick={() => deleteComment(text._id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleEdit(text._id, text.text)}>
                <EditIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;
