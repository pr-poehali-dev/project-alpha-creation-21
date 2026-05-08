
CREATE TABLE t_p10348444_project_alpha_creati.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(64),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p10348444_project_alpha_creati.mods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(512) NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by INT REFERENCES t_p10348444_project_alpha_creati.users(id)
);
