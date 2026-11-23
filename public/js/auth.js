// auth.js - used by signup.html and login.html
// 1. Checks the email before the form is sent
// 2. Shows a message when the server sends the user back with an error

document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const messageBox = document.getElementById("form-message");

  // Regular expression for an email: text @ text . at least 2 letters
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // 1. Runs when the user clicks Create Account / Log In
  form.addEventListener("submit", function (event) {
    if (!emailPattern.test(emailInput.value.trim())) {
      event.preventDefault();          // stop the form from being sent
      messageBox.textContent = "Please enter a valid email address, e.g. name@example.com.";
    }
  });

  // 2. server.js adds ?error=... to the address when something went wrong.
  // URLSearchParams reads the part of the address after the "?".
  const error = new URLSearchParams(window.location.search).get("error");

  // textContent shows plain text only, so nothing typed into the address bar can run as code (XSS-safe)
  if (error === "wrong") {
    messageBox.textContent = "Email or password is incorrect.";
  }
  if (error === "exists") {
    messageBox.textContent = "An account with this email already exists. Please log in.";
  }
  if (error === "invalid") {
    messageBox.textContent = "Please fill in every field with a valid email.";
  }

});