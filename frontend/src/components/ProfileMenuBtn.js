import { useContext, useState } from "react";
import { AccountCircleRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Switch, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginStateCtx } from "../Contexts";

function ProfileMenuBtn({ setTheme }) {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoginStateCtx);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    if (event.target.checked) setTheme("dark");
    else setTheme("light");
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <IconButton variant="outlined" onClick={handleClick}>
        <AccountCircleRounded />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 0.5 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem component={NavLink} onClick={handleClose} to="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
        <MenuItem>
          <Typography>Dark Mode</Typography>
          <Switch label="Theme" onChange={handleChange} />
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenuBtn;
