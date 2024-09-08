import { Card, CardActionArea, Typography } from "@mui/material";

function CommunityCard({ community }) {
  return (
    <Card key={community._id} sx={{ maxWidth: 300, maxHeight: 400, p: 1 }}>
      <CardActionArea sx={{ minWidth: 225, minHeight: 300 }}>
        <Typography variant="h5">{community.name}</Typography>
        <Typography variant="body1">{community.description}</Typography>
      </CardActionArea>
    </Card>
  );
}

export default CommunityCard;
