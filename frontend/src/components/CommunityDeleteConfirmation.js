import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CommunityDeleteConfirmation({ setOpen }) {
  const navigate = useNavigate();
  const { name } = useParams();
  const handleDelete = () => {
    axios.delete(`/api/community/${name}`).then((res) => {
      if (res.data.success) navigate("/");
      else console.log(res.data.message);
    });
  };
  return (
    <>
      <DialogTitle id="alert-dialog-title">Delete this community?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDelete();
            setOpen(false);
          }}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </>
  );
}

export default CommunityDeleteConfirmation;
