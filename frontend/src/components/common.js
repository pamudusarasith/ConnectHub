import { styled, Button } from "@mui/material";

const RoundButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  paddingInline: "20px",
  paddingTop: "8px",
  ":hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const RoundButtonOutlined = styled(Button)(({ theme }) => ({
  border: "solid 1px",
  borderColor: theme.palette.primary.dark,
  borderRadius: "20px",
  color: theme.palette.text.primary,
  paddingInline: "20px",
  paddingTop: "8px",
  ":hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export { RoundButton, RoundButtonOutlined };
