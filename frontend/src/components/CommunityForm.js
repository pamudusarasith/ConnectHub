import { Box, Container, TextField, Typography } from "@mui/material";
import { RoundButton } from "./common";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginStateCtx } from "../Contexts";

function CommunityForm({ data, setOpen }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: data?.community.name || "",
    description: data?.community.description || "",
  });
  const [error, setError] = useState("");
  const { setIsLoggedIn } = useContext(LoginStateCtx);

  const handleCreate = () => {
    axios.post("/api/community", formData).then((res) => {
      if (res.data.success) {
        setOpen(false);
        navigate(`/community/${formData.name}`);
      } else if (res.data.code === 401) {
        setOpen(false);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    });
  };

  const handleEdit = () => {
    axios.put(`/api/community/${data.community.name}`, formData).then((res) => {
      if (res.data.success) {
        setOpen(false);
        navigate(`/community/${formData.name}`);
      } else if (res.data.code === 401) {
        setOpen(false);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ m: 4 }}>
        <Typography variant="h4">
          {data ? "Update" : "Create"} Community
        </Typography>
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <RoundButton sx={{ mt: 2 }} onClick={data ? handleEdit : handleCreate}>
          <Typography variant="button">{data ? "Save" : "Create"}</Typography>
        </RoundButton>
      </Box>
    </Container>
  );
}

export default CommunityForm;
