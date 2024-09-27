const { sqliteConn } = require("../database/db_connection")
const errorHandler = require("../utils/errorHandler");



class tags_controller {
    async create(req, res) {
        const {user_id} = req.usuario
        const {note_id} = req.params
        const tags = req.body

        const database = await sqliteConn()

        const foundNote = await database.get('select * from movie_notes where id = ? and user_id = ?', [note_id, user_id])
        
        if(!foundNote) {
            throw new errorHandler("Nota não encontrada.")
        }

        tags.forEach(async tag => {
            await database.run(`insert into movie_tags (note_id, user_id, name) values
                (?, ?, ?)`, note_id, user_id, tag.name)
        })

        res.send('Tags criadas.')
    }
    


    async read(req, res){
        const {user_id} = req.usuario
        const {note_id, tag_id} = req.query
        const database = await sqliteConn()

        const userFound = await database.get('select * from movie_tags where user_id=?', [user_id])
        if(!userFound) {
            throw new errorHandler("User sem nota.")
        }

        if(!tag_id && !note_id) {
            console.log('caiu aqui')
            const results = await database.all(`select * from movie_tags where user_id = ?`, [user_id])
            return res.json(results)
        }
    
        if(!note_id) {
            const results = await database.all(`select * from movie_tags where user_id = ? and id = ?`, [user_id, tag_id])
            return res.json(results)
        }

        if(!tag_id) {
            const results = await database.all(`select * from movie_tags where user_id = ? and note_id = ?`, [user_id, note_id])
            return res.json(results)
        }


        const results = await database.all(`select * from movie_tags where user_id = ? and note_id = ? and id = ?`, [user_id, note_id, tag_id])
        return res.json(results)
    }



    async update(req, res){
        const {user_id} = req.usuario
        const {tag_id} = req.params
        const {name} = req.body

        const database = await sqliteConn()
        
        const foundUserTag = await database.get('select * from movie_tags where id = ? and user_id = ?', 
            [tag_id, user_id])

        if(!foundUserTag) {
            throw new errorHandler("Tag não encontrada.")
        }

        if(!name || foundUserTag.name === name) {
            throw new errorHandler("Informe o novo nome da tag.")
        }

        await database.run(`update movie_tags set name = ? where id = ?`, [name, tag_id])
        const updatedRegister = await database.all('select * from movie_tags where id = ?', [tag_id])
        res.json(updatedRegister)
    }



    async delete(req, res){
        const {user_id} = req.usuario
        const {tag_id} = req.params
        const database = await sqliteConn()
        const tagFound = await database.get('select * from movie_tags where user_id = ? and id = ?', [user_id, tag_id])

        if(!tagFound) {
            throw new errorHandler("Tag não encontrada.")
        }

        await database.run('delete from movie_tags where id = ?', [tag_id])
        res.send('Tag removida.')
    }
}



module.exports = {tags_controller}

