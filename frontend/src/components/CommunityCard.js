import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { LoginStateCtx } from "../Contexts";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { RoundButton } from "./common";
import { PeopleAltRounded } from "@mui/icons-material";

function CommunityCard({ community }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(LoginStateCtx);
  const [isMember, setIsMember] = useState(community.isMember);

  const handleJoin = () => {
    if (!isLoggedIn) return navigate("/login");
    axios.post(`/api/community/${community.name}/join`).then((res) => {
      if (res.data.success) setIsMember(true);
    });
  };

  const handleLeave = () => {
    axios.post(`/api/community/${community.name}/leave`).then((res) => {
      if (res.data.success) setIsMember(false);
    });
  };

  return (
    <Card
      key={community._id}
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      raised
    >
      <CardActionArea
        LinkComponent={NavLink}
        to={`/community/${community.name}`}
        sx={{ height: 1, width: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom>
          {community.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {community.description}
        </Typography>
        <Stack direction="row" spacing={1} mt={2}>
          <PeopleAltRounded />
          <Typography variant="body2">{community.membersCount}</Typography>
        </Stack>
      </CardActionArea>
      {isMember ? (
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
