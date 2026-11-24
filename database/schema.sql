
-- One row for every account (signup.html)
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,   -- 1, 2, 3 ... given automatically
  role          TEXT NOT NULL,                       -- donor, recipient or volunteer
  full_name     TEXT NOT NULL,
  org_name      TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,                -- two accounts can't share an email
  password_hash TEXT NOT NULL,                       -- scrambled password, never the real one
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- One row for every food donation (create-donation.html)
CREATE TABLE IF NOT EXISTS donations (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id       INTEGER NOT NULL,                   -- which user posted it
  food_item      TEXT NOT NULL,
  quantity       TEXT NOT NULL,
  pickup_by      TEXT NOT NULL,                      -- e.g. 2026-11-24T16:00
  pickup_address TEXT NOT NULL,
  status         TEXT DEFAULT 'Available',           -- Available, Claimed, Picked up, Completed, Expired
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id)        -- links each donation to a user
);


