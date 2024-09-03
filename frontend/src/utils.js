import axios from "axios";

function validateEmail(email) {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return re.test(email);
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9_]{6,30}$/g;
  return re.test(username);
}

function setAuthHeader() {
  const token = localStorage.getItem("token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export { validateEmail, validateUsername, setAuthHeader };
