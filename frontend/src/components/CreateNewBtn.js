import { useState } from "react";
import { RoundButton } from "./common";
import { AddRounded } from "@mui/icons-material";
import { Dialog, Menu, MenuItem, Typography } from "@mui/material";
import CommunityForm from "./CommunityForm";

function CreateNewBtn() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCommunityForm, setOpenCommunityForm] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <RoundButton variant="outlined" onClick={handleClick}>
        <AddRounded />
        <Typography variant="button">New</Typography>
      </RoundButton>
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
        <MenuItem onClick={handleClose}>Post</MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenCommunityForm(true);
          }}
        >
          Community
        </MenuItem>
      </Menu>
      <Dialog
        open={openCommunityForm}
        onClose={() => setOpenCommunityForm(false)}
      >
        <CommunityForm setOpen={setOpenCommunityForm} />
      </Dialog>
    </>
  );
}

export default CreateNewBtn;
