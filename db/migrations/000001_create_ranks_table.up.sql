CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ranks (
  id UUID DEFAULT uuid_generate_v4(),
  google_user_id VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);