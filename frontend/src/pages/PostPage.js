import Comment from "../components/Comment.js";
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
  Dialog,
  Stack,
  Link,
  Container,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThumbUp, Comment as CommentICON, MoreVert } from "@mui/icons-material";
import PostForm from "../components/PostForm";
import axios from "axios";

function PostPage() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/post/${id}`).then((res) => {
      if (res.status === 200) {
        setPost(res.data);
        setLiked(res.data.isLiked);
      }
    });
  }, []);

  const [anchorE1, setAnchorE1] = useState(null);
  const [openPostForm, setOpenPostForm] = useState(false);
  const [openComment, setOpenComment] = useState(
    searchParams.get("action") === "comment"
  );

  const handelLike = () => {
    axios.post("/api/post/" + post._id + "/like").then((res) => {
      if (res.data.success) {
        setLiked(!liked);
      } else if (res.data.code === 401) {
        navigate("/login");
      }
    });
  };

  const handelMenuOpen = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handelMenuClose = () => {
    setAnchorE1(null);
  };

  const handelCommentOpen = () => {
    setOpenComment(!openComment);
  };

  const handelDeleteClick = async () => {
   axios.delete(`/api/post/`+post._id).then((res) => {
    if (res.status === 200) {
      window.location.reload();
    }
   })
    

  
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ maxWidth: "100%" }}>
        <CardHeader
          avatar={
            <Stack direction="row" alignItems={"center"} spacing={4}>
              <Avatar aria-label="recipe">
                {post?.author.firstName[0] + post?.author.lastName[0]}
              </Avatar>
              <Typography>{post?.author.username}</Typography>
              <Typography variant="subtitle2">
                {formatDate(post?.createdAt)}
              </Typography>
            </Stack>
          }
        />
        <Link href={"/post/" + post?._id} underline="none">
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
          <IconButton aria-label="comment" onClick={handelCommentOpen}>
            <CommentICON />
          </IconButton>
          {post?.isOwner &&<IconButton aria-label="more" onClick={handelMenuOpen}>
            <MoreVert />
            </IconButton>}
          <Menu
            anchorEl={anchorE1}
            open={Boolean(anchorE1)}
            onClose={handelMenuClose}
          >
            <MenuItem
              onClick={() => {
                handelMenuClose();
                setOpenPostForm(true);
              }}
            >
              {" "}
              Update
            </MenuItem>
            <MenuItem onClick={handelDeleteClick}>Delete</MenuItem>
          </Menu>

          <Dialog open={openPostForm} onClose={() => setOpenPostForm(false)}>
            <PostForm setOpen={setOpenPostForm} post={post} />
          </Dialog>
        </CardActions>
      </Card>

      <Comment openComment={openComment} setOpenComment={setOpenComment} />
    </Container>
  );
}

export default PostPage;
