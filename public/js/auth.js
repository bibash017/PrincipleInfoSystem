// auth.js - used by signup.html and login.html
// Accounts are saved in localStorage (they stay after the browser is closed).
// The logged-in user is saved in sessionStorage (cleared when the tab is closed).

document.addEventListener("DOMContentLoaded", function () {

  const signupForm = document.getElementById("signup-form");   // only on signup.html
  const loginForm = document.getElementById("login-form");     // only on login.html
  const messageBox = document.getElementById("form-message");

  // email pattern: text @ text . at least 2 letters
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // all saved accounts. JSON.parse turns the saved text back into an array.
  // If nothing is saved yet, we start with an empty array [].
  const users = JSON.parse(localStorage.getItem("foodbridgeUsers")) || [];

  // Remembers who is logged in, then opens the right page for their role
  function startSession(user) {
    const currentUser = {
      role: user.role,
      fullName: user.fullName,
      orgName: user.orgName,
      email: user.email
    };
    sessionStorage.setItem("foodbridgeCurrentUser", JSON.stringify(currentUser));

    if (user.role === "donor") {
      window.location.href = "donor-dashboard.html";
    } else {
      window.location.href = "find-food.html";
    }
  }


  // ----- SIGN UP -----
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();        // stop the page from reloading

      const email = document.getElementById("email").value.trim().toLowerCase();

      // filter keeps the accounts that already use this email
      const sameEmail = users.filter(user => user.email === email);

      if (!emailPattern.test(email)) {
        messageBox.textContent = "Please enter a valid email address, e.g. name@example.com.";
      } else if (sameEmail.length > 0) {
        messageBox.textContent = "An account with this email already exists. Please log in.";
      } else {
        const newUser = {
          role: document.getElementById("role").value,
          fullName: document.getElementById("full-name").value.trim(),
          orgName: document.getElementById("org-name").value.trim(),
          email: email,
          // a real website would never keep passwords in the browser (see the SQL file)
          password: document.getElementById("password").value
        };

        users.push(newUser);
        localStorage.setItem("foodbridgeUsers", JSON.stringify(users));   // save as text
        startSession(newUser);
      }
    });
  }


  // ----- LOG IN -----
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value;

      // keep only the account where BOTH the email and the password match
      const matchingUsers = users.filter(user => user.email === email && user.password === password);

      if (!emailPattern.test(email)) {
        messageBox.textContent = "Please enter a valid email address, e.g. name@example.com.";
      } else if (matchingUsers.length === 0) {
        messageBox.textContent = "Email or password is incorrect.";
      } else {
        startSession(matchingUsers[0]);
      }
    });
  }

});