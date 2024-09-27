const users = `
CREATE TABLE IF NOT EXISTS users 
(
  id            INTEGER         PRIMARY KEY AUTOINCREMENT
, name          VARCHAR(255)    NOT NULL
, email         VARCHAR(255)    NOT NULL
, password      VARCHAR(20)     NOT NULL
, avatar        VARCHAR(255)
, created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP
, updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP
);
`

module.exports = {users}