import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { ThumbUp, Comment,MoreVert } from "@mui/icons-material";

function Post(post) {
  const [anchorE1, setAnchorE1] = useState(null);

  const handelMenuOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handelMenuClose = () => {
    setAnchorE1(null);
  };
  return (
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
        <Typography variant="body2" color="text.secondary" align="center">
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
        <IconButton aria-label="more" onClick={handelMenuOpen}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorE1}
          open={Boolean(anchorE1)}
          onClose={handelMenuClose}
        >
          <MenuItem onClick={handelMenuClose}> Update</MenuItem>
          <MenuItem onClick={handelMenuClose}>Delete</MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}

export default Post;
