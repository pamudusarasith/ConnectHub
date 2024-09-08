import { Container, IconButton, Stack } from "@mui/material";
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
  console.log(cards);
  return (
    <Container maxWidth="md" alignItems="center">
      <Stack direction="row" spacing={2}>
        {page > 0 && (
          <IconButton sx={{ borderRadius: 2 }} onClick={handlePrevPage}>
            <NavigateBefore />
          </IconButton>
        )}
        {cards?.slice(page * cardsPerPage, (page + 1) * cardsPerPage)}
        {cards && cards.length > (page + 1) * cardsPerPage && (
          <IconButton sx={{ borderRadius: 2 }} onClick={handleNextPage}>
            <NavigateNext />
          </IconButton>
        )}
      </Stack>
    </Container>
  );
}

export default CommunityCarousel;
