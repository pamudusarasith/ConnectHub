import { styled, Button } from "@mui/material";

const RoundButton = styled(Button)(({ variant, theme }) => ({
  border: variant === "outlined" ? "solid 1px" : "none",
  borderColor: variant === "outlined" ? theme.palette.primary.dark : "none",
  borderRadius: "20px",
  color: theme.palette.text.primary,
  backgroundColor:
    variant === "outlined" ? "transparent" : theme.palette.secondary.main,
  paddingInline: "20px",
  paddingTop: "8px",
  ":hover": {
    backgroundColor:
      variant === "outlined"
        ? theme.palette.primary.dark
        : theme.palette.secondary.dark,
  },
}));

export { RoundButton };
