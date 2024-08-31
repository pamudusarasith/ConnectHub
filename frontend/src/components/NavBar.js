import { styled, Button, Stack, Divider, IconButton } from "@mui/material";
import { LightModeRounded, DarkModeRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { isLoggedIn, logout } from "../utils";

const RoundButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  paddingInline: "20px",
  paddingTop: "8px",
  ":hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

function NavBar({ theme, setTheme }) {
  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };
  return (
    <Stack direction={"column"}>
      <Stack
        sx={{ margin: "10px" }}
        spacing={2}
        direction={"row"}
        justifyContent={"flex-end"}
      >
        {!isLoggedIn() && (
          <>
            <RoundButton component={NavLink} to="/login">
              Log In
            </RoundButton>
            <RoundButton component={NavLink} to="/register">
              Sign Up
            </RoundButton>
          </>
        )}
        {isLoggedIn() && <RoundButton onClick={logout}>Log Out</RoundButton>}
        <IconButton onClick={handleThemeChange}>
          {theme === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        </IconButton>
      </Stack>
      <Divider />
    </Stack>
  );
}

export default NavBar;
