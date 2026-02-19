DROP TABLE IF EXISTS
  session_players,
  sessions,
  friendships,
  group_members,
  groups,
  locations,
  user_favorite_locations,
  userBoardgames,
  boardgames,
  users
CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(60) NOT NULL UNIQUE,
  avatar_url TEXT DEFAULT '/uploads/avatars/default.png',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE boardgames (
  game_id SERIAL PRIMARY KEY,
  bgg_id INT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  year_published INT,
  rank INT,
  bayes_average DECIMAL(5,2),
  average DECIMAL(5,2),
  users_rated INT,
  is_expansion BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  bgg_fetched_at TIMESTAMPTZ
);

CREATE TABLE userBoardgames (
  auth0_id TEXT NOT NULL REFERENCES users(auth0_id) ON DELETE CASCADE,
  bgg_id INT NOT NULL REFERENCES boardgames(bgg_id) ON DELETE CASCADE,
  PRIMARY KEY (auth0_id, bgg_id)
);

CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE group_members (
  group_id INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE friendships (
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  friend_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'accepted',
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);

CREATE TABLE locations (
  location_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  UNIQUE (latitude, longitude)
);

CREATE TABLE user_favorite_locations (
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  location_id INT NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, location_id)
);

CREATE TABLE sessions (
  session_id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
  game_id INT NOT NULL REFERENCES boardgames(game_id) ON DELETE RESTRICT,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  location_id INT REFERENCES locations(location_id) ON DELETE SET NULL,
  notes VARCHAR(2000)
);

CREATE TABLE session_players (
  session_id INT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  guest_name VARCHAR(255),
  score INT,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (session_id, COALESCE(user_id, guest_name))
);

CREATE INDEX idx_sessions_group_played_at
  ON sessions (group_id, played_at DESC);

CREATE INDEX idx_sessions_game
  ON sessions (game_id);

CREATE INDEX idx_session_players_user
  ON session_players (user_id);

ALTER TABLE friendships
  ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE friendships
  ADD CONSTRAINT friendships_status_check
  CHECK (status IN ('pending', 'accepted'));

ALTER TABLE friendships
  ADD COLUMN request_id SERIAL;

ALTER TABLE friendships
  DROP CONSTRAINT friendships_pkey;

ALTER TABLE friendships
  ADD CONSTRAINT friendships_pkey PRIMARY KEY (request_id);

ALTER TABLE friendships
  ADD CONSTRAINT friendships_user_id_friend_id_key UNIQUE (user_id, friend_id);

  CREATE TABLE IF NOT EXISTS invites (
  invite_id SERIAL PRIMARY KEY,
  invited_email VARCHAR(255) NOT NULL,
  invited_by_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS invites_token_uq ON invites(token);

CREATE INDEX IF NOT EXISTS idx_friendships_friend_pending
ON friendships(friend_id, status);

ALTER TABLE friendships ALTER COLUMN status SET DEFAULT 'pending';
