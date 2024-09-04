import { useState } from "react";
import { RoundButton } from "./common";
import { MoreHorizRounded } from "@mui/icons-material";
import { Dialog, Menu, MenuItem } from "@mui/material";
import CommunityForm from "./CommunityForm";
import CommunityDeleteConfirmation from "./CommunityDeleteConfirmation";

function CommunityMenuBtn({ data }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCommunityForm, setOpenCommunityForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
        <MoreHorizRounded />
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
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenCommunityForm(true);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenDeleteDialog(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={openCommunityForm}
        onClose={() => setOpenCommunityForm(false)}
      >
        <CommunityForm setOpen={setOpenCommunityForm} data={data} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <CommunityDeleteConfirmation setOpen={setOpenDeleteDialog} />
      </Dialog>
    </>
  );
}

export default CommunityMenuBtn;
