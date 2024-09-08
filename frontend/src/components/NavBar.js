import { Stack, Divider, IconButton, Typography, Dialog } from "@mui/material";
import {
  LightModeRounded,
  DarkModeRounded,
  MenuRounded,
  AddRounded,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { RoundButton } from "./common";
import { useState, useContext } from "react";
import { LoginStateCtx } from "../Contexts";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideBar from "./SideBar.js";
import ProfileMenuBtn from "./ProfileMenuBtn.js";
import CommunityForm from "./CommunityForm.js";

function NavBar({ theme, setTheme }) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginStateCtx);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCommunityForm, setOpenCommunityForm] = useState(false);

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoggedIn) {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
    } else {
      const payload = jwtDecode(token);
      if (payload.exp < Date.now() / 1000) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    }
  }

  return (
    <Stack direction={"column"}>
      <Stack
        sx={{ margin: "10px" }}
        spacing={2}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <IconButton sx={{ mr: "auto" }} onClick={() => setOpenSidebar(true)}>
          <MenuRounded />
        </IconButton>
        <Stack spacing={2} direction={"row"}>
          {!isLoggedIn && (
            <>
              <RoundButton component={NavLink} to="/login">
                Log In
              </RoundButton>
              <RoundButton component={NavLink} to="/register">
                Sign Up
              </RoundButton>
              <IconButton onClick={handleThemeChange}>
                {theme === "light" ? <DarkModeRounded /> : <LightModeRounded />}
              </IconButton>
            </>
          )}
          {isLoggedIn && (
            <>
              <RoundButton
                variant="outlined"
                onClick={() => setOpenCommunityForm(true)}
              >
                <AddRounded />
                <Typography variant="button">Community</Typography>
              </RoundButton>
              <RoundButton onClick={logout}>Log Out</RoundButton>
              <ProfileMenuBtn theme={theme} setTheme={setTheme} />
            </>
          )}
          <SideBar open={openSidebar} setOpen={setOpenSidebar} />
          <Dialog
            open={openCommunityForm}
            onClose={() => setOpenCommunityForm(false)}
          >
            <CommunityForm setOpen={setOpenCommunityForm} />
          </Dialog>
        </Stack>
      </Stack>
      <Divider />
    </Stack>
  );
}

export default NavBar;
