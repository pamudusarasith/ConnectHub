import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginStateCtx } from "../Contexts.js";

function SideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(LoginStateCtx);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    axios.get("/api/community/joined").then((res) => {
      if (res.data.success) setData(res.data.data);
    });
  }, [isLoggedIn]);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <Stack spacing={1} sx={{ p: 1, minWidth: 250, mt: 2 }}>
        <Button sx={{ boxShadow: 1 }} onClick={() => navigate("/")}>
          Home
        </Button>
        <Divider />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRounded />}>
            <Typography>Communities</Typography>
          </AccordionSummary>
          <Stack>
            {data?.map((community, i) => (
              <Button key={i} onClick={() => navigate(`/community/${community.name}`)}>
                {community.name}
              </Button>
            ))}
          </Stack>
        </Accordion>
      </Stack>
    </Drawer>
  );
}

export default SideBar;
