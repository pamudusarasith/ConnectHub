import React,{useState} from "react";
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
  Dialog
} from "@mui/material";
import PostForm from './PostForm';
import { ThumbUp, Comment,MoreVert } from "@mui/icons-material";

function Post({post}) {
  const [anchorE1, setAnchorE1] = useState(null);
  const [openPostForm,setOpenPostForm]=useState(false);

  const handelMenuOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handelMenuClose = () => {
    setAnchorE1(null);
  };

  const handelDeleteClick = async () => {
    const response = await fetch('/api/post/'+ post._id ,{
        method:'DELETE'
    })
    const json = await response.json()

    if(response.ok){
        window.location.reload()
    }
  }
  console.log(post)
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
          <MenuItem onClick={() => {
            handelMenuClose();
            setOpenPostForm(true);
          }
            

          }> Update</MenuItem>
          <MenuItem onClick={handelDeleteClick}>Delete</MenuItem>
        </Menu>
        <Dialog
        open={openPostForm}
        onClose={() => setOpenPostForm(false)}
      >
        <PostForm setOpen={setOpenPostForm} post={post} />
      </Dialog>
      </CardActions>
    </Card>
  );
}

export default Post;
