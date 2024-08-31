import { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  Button,
  Link,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { validateEmail, validateUsername } from "../utils";

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [isInvalid, setIsInvalid] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;
    for (const key in formData) valid &&= validateValue(key, formData[key]);

    if (!valid) return;

    axios.post("/api/register", formData).then((response) => {
      if (response.data.success) {
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
        });
        setIsInvalid({});
        navigate("/login");
      } else {
        setErrorMsg(response.data.message);
      }
    });
  };

  const validateValue = (name, value) => {
    let invalid = false;
    switch (name) {
      case "email":
        if (!validateEmail(value)) invalid = true;
        break;
      case "username":
        if (!validateUsername(value)) invalid = true;
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
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
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                error={isInvalid.firstName}
                id="firstName"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                name="firstName"
                value={formData.firstName}
                autoFocus
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="family-name"
                error={isInvalid.lastName}
                id="lastName"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                name="lastName"
                value={formData.lastName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                error={isInvalid.username}
                id="username"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                name="username"
                value={formData.username}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                error={isInvalid.email}
                id="email"
                label="Email Address"
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
                autoComplete="new-password"
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
                        onClick={handleClickShowPassword}
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
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            variant="contained"
            fullWidth
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={NavLink} to="/login" variant="body2">
                Already have an account? Log In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
