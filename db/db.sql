DROP TABLE IF EXISTS
  session_players,
  sessions,
  friendships,
  group_members,
  groups,
  locations,
  boardgames,
  users
CASCADE;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(60) NOT NULL UNIQUE,
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
  is_expansion BOOLEAN DEFAULT false
);

CREATE TABLE userBoardgames (
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  bgg_id INT NOT NULL REFERENCES boardgames(bgg_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, bgg_id)
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
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE sessions (
  session_id SERIAL PRIMARY KEY,
  group_id INT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  game_id INT NOT NULL REFERENCES boardgames(game_id) ON DELETE RESTRICT,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  location_id INT REFERENCES locations(location_id) ON DELETE SET NULL,
  notes VARCHAR(2000)
);

CREATE TABLE session_players (
  session_id INT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  score INT,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (session_id, user_id)
);

CREATE INDEX idx_sessions_group_played_at
  ON sessions (group_id, played_at DESC);

CREATE INDEX idx_sessions_game
  ON sessions (game_id);

CREATE INDEX idx_session_players_user
  ON session_players (user_id);
