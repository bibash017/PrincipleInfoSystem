// server.js - a small web server for FoodBridge
// It does two jobs:
//   1. Sends our pages (HTML, CSS, JS, images) from the "public" folder to the browser
//   2. Saves new accounts in the database and checks log ins
//
// Start it with:   node server.js
// Then open:       http://localhost:3000
//
// Everything here is built into Node.js, so there is nothing to install.

const http = require("http");                     // makes the web server
const fs = require("fs");                         // reads files
const path = require("path");                     // joins folder and file names
const crypto = require("crypto");                 // scrambles (hashes) passwords
const { DatabaseSync } = require("node:sqlite");  // SQL database (Node 22.13 or newer)

const PORT = 3000;
const PUBLIC_FOLDER = path.join(__dirname, "public");

// The same email pattern as js/auth.js. We check again here because
// anyone can skip the JavaScript in their browser.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const allowedRoles = ["donor", "recipient", "volunteer"];


// ---------- 1. Database ----------
// Opens database/foodbridge.db (creates the file the first time)
// and runs schema.sql to make sure the users table exists.
const database = new DatabaseSync(path.join(__dirname, "database", "foodbridge.db"));
database.exec(fs.readFileSync(path.join(__dirname, "database", "schema.sql"), "utf8"));


// ---------- 2. Small helpers ----------

// Tells the browser what kind of file it is receiving
const fileTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

// Sends a file from the public folder, or "Page not found"
function sendFile(response, urlPath) {
  let filePath = path.join(PUBLIC_FOLDER, urlPath);
  if (urlPath === "/") {
    filePath = path.join(PUBLIC_FOLDER, "index.html");
  }

  // Security: never send files from outside the public folder (e.g. /../server.js)
  if (!filePath.startsWith(PUBLIC_FOLDER)) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Page not found");
  } else {
    fs.readFile(filePath, function (error, fileData) {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Page not found");
      } else {
        response.writeHead(200, { "Content-Type": fileTypes[path.extname(filePath)] || "application/octet-stream" });
        response.end(fileData);
      }
    });
  }
}

// Sends the browser to another page
function goTo(response, address) {
  response.writeHead(303, { Location: address });
  response.end();
}

// Sends each role to its own page after sign up / log in
function goToHomeFor(response, role) {
  if (role === "donor") {
    goTo(response, "/donor-dashboard.html");
  } else {
    goTo(response, "/find-food.html");
  }
}

// A form arrives in small pieces ("chunks"). We join them together,
// then URLSearchParams turns "email=a%40b.com&password=123" into values we can read.
function readForm(request, whenFinished) {
  let formText = "";
  request.on("data", function (chunk) {
    formText += chunk;
  });
  request.on("end", function () {
    whenFinished(new URLSearchParams(formText));
  });
}


// ---------- 3. The server ----------
const server = http.createServer(function (request, response) {

  // decodeURIComponent turns "Food%20Bridge-logo.png" back into "Food Bridge-logo.png".
  // split("?")[0] removes anything after "?", like ?error=wrong
  const urlPath = decodeURIComponent(request.url.split("?")[0]);

  // --- Sign up form was sent ---
  if (request.method === "POST" && urlPath === "/signup") {
    readForm(request, function (form) {
      const role = form.get("role");
      const fullName = (form.get("fullName") || "").trim();
      const orgName = (form.get("orgName") || "").trim();
      const email = (form.get("email") || "").trim().toLowerCase();
      const password = form.get("password") || "";

      // sha256 turns the password into a long code. The same password always gives the same code,
      // so we can compare codes at log in without ever saving the real password.
      const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

      // The ? marks are filled in safely by the database, so typed text can never
      // change the SQL command itself (this stops "SQL injection").
      const existingUser = database.prepare("SELECT id FROM users WHERE email = ?").get(email);

      if (!allowedRoles.includes(role) || fullName === "" || orgName === "" || !emailPattern.test(email) || password === "") {
        goTo(response, "/signup.html?error=invalid");
      } else if (existingUser) {
        goTo(response, "/signup.html?error=exists");
      } else {
        database
          .prepare("INSERT INTO users (role, full_name, org_name, email, password_hash) VALUES (?, ?, ?, ?, ?)")
          .run(role, fullName, orgName, email, passwordHash);
        goToHomeFor(response, role);
      }
    });

  // --- Log in form was sent ---
  } else if (request.method === "POST" && urlPath === "/login") {
    readForm(request, function (form) {
      const email = (form.get("email") || "").trim().toLowerCase();
      const passwordHash = crypto.createHash("sha256").update(form.get("password") || "").digest("hex");

      // Find the account where both the email and the scrambled password match.
      // The role comes from the database, so the user never has to choose it here.
      const user = database
        .prepare("SELECT role FROM users WHERE email = ? AND password_hash = ?")
        .get(email, passwordHash);

      if (user) {
        goToHomeFor(response, user.role);
      } else {
        goTo(response, "/login.html?error=wrong");
      }
    });

  // --- Anything else: send the page or file that was asked for ---
  } else {
    sendFile(response, urlPath);
  }
});

server.listen(PORT, function () {
  console.log("FoodBridge is running at http://localhost:" + PORT);
});