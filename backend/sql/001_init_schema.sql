-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  badges TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id)
);

-- COOKING LOGS
CREATE TABLE IF NOT EXISTS cooking_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  recipe_id INT REFERENCES recipes(id),
  cooked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cook_time INT,
  rating INT CHECK (rating BETWEEN 1 AND 5)
);

-- DAILY CHALLENGES
CREATE TABLE IF NOT EXISTS daily_challenges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  date DATE,
  cooked_meal BOOLEAN DEFAULT FALSE,
  planned_meal BOOLEAN DEFAULT FALSE,
  logged_in BOOLEAN DEFAULT TRUE,
  UNIQUE (user_id, date)
);

-- WEEKLY MEAL PLAN
CREATE TABLE IF NOT EXISTS weekly_plan (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  day_of_week TEXT,
  recipe_id INT REFERENCES recipes(id),
  planned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
