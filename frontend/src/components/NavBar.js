import { styled, Button, Stack, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";

const RoundButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
}));

function NavBar() {
  return (
    <Stack direction={"column"}>
      <Stack
        sx={{ margin: "10px" }}
        spacing={2}
        direction={"row"}
        justifyContent={"flex-end"}
      >
        <RoundButton component={NavLink} to="/login">
          Log In
        </RoundButton>
        <RoundButton component={NavLink} to="/register">
          Sign Up
        </RoundButton>
      </Stack>
      <Divider />
    </Stack>
  );
}

export default NavBar;
