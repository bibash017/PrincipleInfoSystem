
-- One row for every account
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,  
  role          TEXT NOT NULL,                       
  full_name     TEXT NOT NULL,
  org_name      TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,                -- two accounts can't share an email
  password_hash TEXT NOT NULL,                       -- scrambled password, never the real one
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP       -- date and time the account was made
);