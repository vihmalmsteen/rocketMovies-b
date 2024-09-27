const sqlite3 = require('sqlite3')   // driver
const sqlite = require('sqlite')     // db
const path = require('path')

async function sqliteConn() {
    const DB = await sqlite.open({
        filename: path.resolve(__dirname, 'moviesDB.db'),       // se nao tem o arquivo do DB ele cria nesse diretorio com esse nome
        driver:sqlite3.Database
    })
    await DB.run('PRAGMA foreign_keys = ON;')
    
    return DB   // dentro desse obj que se pode fazer consultas com os métodos exec, all, run...
}

module.exports = {sqliteConn}

