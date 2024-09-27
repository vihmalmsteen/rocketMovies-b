const movie_tags = `
CREATE TABLE IF NOT EXISTS movie_tags (
  id        INTEGER         PRIMARY KEY AUTOINCREMENT
, note_id   INTEGER         NOT NULL REFERENCES movie_notes(id) ON DELETE CASCADE ON UPDATE CASCADE
, user_id   INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
, name      VARCHAR(255)    NOT NULL
);
`


module.exports = {movie_tags}