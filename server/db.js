const Database = require('better-sqlite3');
const db = new Database('./data.db');

db.prepare(`
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  color TEXT,
  copyAliaText TEXT,
  googleReviewUrl TEXT,
  vcard_name TEXT,
  vcard_phone TEXT,
  vcard_email TEXT,
  editToken TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  profile_id TEXT,
  title TEXT,
  url TEXT,
  position INTEGER,
  FOREIGN KEY(profile_id) REFERENCES profiles(id)
)
`).run();

module.exports = db;