import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";
import { lightTheme, darkTheme } from "./Theme";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import CommunityPage from "./pages/Community";
import { setAuthHeader } from "./utils";
import { LoginStateCtx } from "./Contexts";
import PostPage from "./pages/PostPage";
import UserProfile from "./pages/UserProfile";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );
  setAuthHeader();

  const setThemeHelper = (theme) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
  }

  return (
    <LoginStateCtx.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <div className="App">
          <CssBaseline />
          <BrowserRouter>
            <NavBar theme={theme} setTheme={setThemeHelper} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/community/:name" element={<CommunityPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </LoginStateCtx.Provider>
  );
}

export default App;
