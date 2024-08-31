function validateEmail(email) {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return re.test(email);
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9_]{6,30}$/g;
  return re.test(username);
}

function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

function logout() {
  localStorage.removeItem("token");
}

export { validateEmail, validateUsername, isLoggedIn, logout };
