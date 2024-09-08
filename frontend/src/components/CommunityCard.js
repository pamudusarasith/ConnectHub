import { Card, CardActionArea, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { LoginStateCtx } from "../Contexts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RoundButton } from "./common";

function CommunityCard({ community }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(LoginStateCtx);
  const [data, setData] = useState({});

  const handleJoin = () => {
    if (!isLoggedIn) return navigate("/login");
    axios.post(`/api/community/${community.name}/join`).then((res) => {
      if (res.data.success) setData({ ...data, isMember: true });
    });
  };

  const handleLeave = () => {
    axios.post(`/api/community/${community.name}/leave`).then((res) => {
      if (res.data.success) setData({ ...data, isMember: false });
    });
  };

  return (
    <Card key={community._id} sx={{ maxWidth: 300, maxHeight: 400, p: 1 }} raised>
      <CardActionArea sx={{ minWidth: 225, minHeight: 300 }}>
        <Typography variant="h5" gutterBottom>{community.name}</Typography>
        <Typography variant="body1">{community.description}</Typography>
      </CardActionArea>
      {community.isMember ? (
        <RoundButton variant="outlined" onClick={handleLeave}>
          <Typography variant="button">Leave</Typography>
        </RoundButton>
      ) : (
        <RoundButton onClick={handleJoin}>
          <Typography variant="button">Join</Typography>
        </RoundButton>
      )}
    </Card>
  );
}

export default CommunityCard;
