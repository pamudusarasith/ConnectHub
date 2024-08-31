import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
  Grid,
  Link,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import { validateEmail } from "../utils";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isInvalid, setIsInvalid] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const validateValue = (name, value) => {
    let invalid = false;
    switch (name) {
      case "email":
        if (!validateEmail(value)) invalid = true;
        break;
      default:
        if (value === "") invalid = true;
    }
    setIsInvalid({ ...isInvalid, [name]: invalid });
    return !invalid;
  };

  const handleBlur = (event) =>
    validateValue(event.target.name, event.target.value);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateValue(name, value);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    for (const key in formData) valid &&= validateValue(key, formData[key]);

    if (!valid) return;

    axios.post("/api/login", formData).then((response) => {
      if (response.data.success) {
        setFormData({
          email: "",
          password: "",
        });
        setIsInvalid({});
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setErrorMsg(response.data.message);
      }
    });
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountCircle />
        </Avatar>
        <Typography variant="h5" component="h1">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {errorMsg && (
              <Grid item xs={12}>
                <Typography color="error" sx={{ textTransform: "capitalize" }}>
                  {errorMsg}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                error={isInvalid.email}
                id="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                name="email"
                value={formData.email}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="password"
                error={isInvalid.password}
                id="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={NavLink} to="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
