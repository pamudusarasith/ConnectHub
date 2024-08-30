import { useState } from "react";
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
import { NavLink } from "react-router-dom";
import { validateEmail } from "../utils";

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [invalidFields, setInvalidFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    let isValid = true;
    for (const key in formData) isValid &&= validateValue(key);

    if (!isValid) return;

    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        response.json().then((data) => {
          if (data.success) {
            window.location.href = "/login";
          } else {
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const validateValue = (name) => {
    switch (name) {
      case "email":
        if (!validateEmail(formData.email))
          setInvalidFields({ ...invalidFields, email: true });
        else setInvalidFields({ ...invalidFields, email: false });
        break;
      default:
        if (formData[name] === "")
          setInvalidFields({ ...invalidFields, [name]: true });
        else setInvalidFields({ ...invalidFields, [name]: false });
    }

    return invalidFields[name];
  };

  const handleBlur = (event) => validateValue(event.target.name);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    validateValue(name);
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
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                error={invalidFields.first_name}
                id="firstName"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                name="first_name"
                value={formData.first_name}
                autoFocus
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="family-name"
                error={invalidFields.last_name}
                id="lastName"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                name="last_name"
                value={formData.last_name}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                error={invalidFields.username}
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
                error={invalidFields.email}
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
                error={invalidFields.password}
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
