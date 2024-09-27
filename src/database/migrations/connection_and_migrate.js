const {sqliteConn} = require('../db_connection')
const {users} = require('./table_users_schema')
const {movie_notes} = require('./table_movie_notes_schema')
const {movie_tags} = require('./table_movie_tags_schema')

async function connAndMigrate() {
    const tablesSchemas = [users, movie_notes, movie_tags].join('')   // Método 'join' junta os elementos em uma string, o qual o arg é um separador.
    
    sqliteConn()
    .then(db => db.exec(tablesSchemas))
    .catch(err => console.error(err))
}

module.exports = {connAndMigrate}

