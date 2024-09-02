import { Stack, Divider, IconButton } from "@mui/material";
import { LightModeRounded, DarkModeRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { RoundButton } from "./common";
import { useContext } from "react";
import { LoginStateCtx } from "../Contexts";
import { useNavigate } from "react-router-dom";

function NavBar({ theme, setTheme }) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginStateCtx);

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Stack direction={"column"}>
      <Stack
        sx={{ margin: "10px" }}
        spacing={2}
        direction={"row"}
        justifyContent={"flex-end"}
      >
        {!isLoggedIn && (
          <>
            <RoundButton component={NavLink} to="/login">
              Log In
            </RoundButton>
            <RoundButton component={NavLink} to="/register">
              Sign Up
            </RoundButton>
          </>
        )}
        {isLoggedIn && <RoundButton onClick={logout}>Log Out</RoundButton>}
        <IconButton onClick={handleThemeChange}>
          {theme === "light" ? <DarkModeRounded /> : <LightModeRounded />}
        </IconButton>
      </Stack>
      <Divider />
    </Stack>
  );
}

export default NavBar;
