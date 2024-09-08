import { Box, Container, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CommunityCard from "./CommunityCard";

function CommunityCarousel() {
  const [cards, setCards] = useState(null);
  const [page, setPage] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    axios.get(`/api/community`).then((res) => {
      if (res.data.success)
        setCards(res.data.data.map((c) => <CommunityCard community={c} />));
    });
  }, []);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <Container maxWidth="md" alignItems="center">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr repeat(3, 4fr) 1fr",
          gap: 1,
          height: 300,
        }}
      >
        {page > 0 ? (
          <IconButton
            sx={{ borderRadius: 2, gridColumn: 1 }}
            onClick={handlePrevPage}
          >
            <NavigateBefore />
          </IconButton>
        ) : (
          <div style={{ gridColumn: 1 }}></div>
        )}
        {cards?.slice(page * cardsPerPage, (page + 1) * cardsPerPage)}
        {cards && cards.length > (page + 1) * cardsPerPage && (
          <IconButton
            sx={{ borderRadius: 2, gridColumn: 5 }}
            onClick={handleNextPage}
          >
            <NavigateNext />
          </IconButton>
        )}
      </Box>
    </Container>
  );
}

export default CommunityCarousel;
