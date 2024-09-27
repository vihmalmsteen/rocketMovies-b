const {sqliteConn} = require('../database/db_connection')
const errorHandler = require('../utils/errorHandler')


class notes_controller {
    
    async create(req, res) {
        const {user_id} = req.usuario
        const {title, description, rating, tags} = req.body

        if(!title || !description || !rating) {
            throw new errorHandler("Todos os campos devem ser preenchidos.")
        }

        const database = await sqliteConn()
        
        const userExists = await database.get('select * from users where id = ?', [user_id])
        if(!userExists) {
            throw new errorHandler("Usuário não existe.")
        }
        
        const result = await database.run(`
            INSERT INTO movie_notes (title, description, rating, user_id)
            VALUES (?, ?, ?, ?) RETURNING id
          `, [title, description, rating, user_id]);
          
          console.log(result.lastID)
          const note_id = result.lastID;

        for(const tag of tags) {
            await database.run(`
                INSERT INTO movie_tags (note_id, user_id, name)
                VALUES (?, ?, ?)
            `, [note_id, user_id, tag])
        }

        res.send('Filme e tag(s) criados.')
    }
    

    
    async delete(req, res) {
        const {user_id} = req.usuario
        const {note_id} = req.params
        
        const database = await sqliteConn()
        const noteFound = await database.get(`
            select * from movie_notes 
            where id = ? and user_id = ?`, 
            [note_id, user_id])
        
            if(!noteFound) {
            throw new errorHandler("Nota não encontrada.")
        }

        await database.run('delete from movie_notes where id = ?', [note_id])
        await database.run('delete from movie_tags where note_id = ?', [note_id])
        res.send('Nota e tags deletadas.')
    }



    async read(req, res) {
        const {user_id} = req.usuario
        const {title, note_id} = req.query

        const database = await sqliteConn()

        if(!user_id) {
            throw new errorHandler("Usuário não informado.");
        }

        let sql = `
        select 
          mn.*
        , concat('["', replace(group_concat(mt.name), ',', '","'), '"]') as tags
        , concat('["', replace(group_concat(mt.id), ',', '","'), '"]') as tagsIds
        , u.name as user_name
        from movie_notes mn 
        left join movie_tags mt on mt.note_id = mn.id
        left join users u on u.id = mn.user_id
        where 1=1 
        and mn.user_id = ?`
        const params = [user_id]

        if(title) {
            sql += ` and mn.title like ?`
            params.push(`%${title}%`)
        }

        if(note_id) {
            sql += ` and mn.id = ?`
            params.push(note_id)
        }

        sql += ` group by mn.id`

        const noteExists = await database.all(sql, params)           // res.json

        const userTags = await database.all('select * from movie_tags where user_id = ?', [user_id])
        // console.log(userTags)

        const notesWithTags = await noteExists.map((note) => {                     // res.json
          const noteTags = userTags.filter((tag) => tag.note_id === note.id);
    
          return {
            ...note,
            tags: noteTags,
          }
        })
        console.log(noteExists)

        res.json(noteExists)      // notesWithTags || noteExists
    }
    
    async readTags(req, res) {
        const {user_id} = req.usuario
        const database = await sqliteConn()
        
        const sql = `
        SELECT 
        mn.user_id
        , mn.id AS note_id
        , mn.title AS note_title
        , mt.id AS tag_id
        , mt.name AS tag_name
        FROM movie_notes mn 
        LEFT JOIN movie_tags mt ON mt.note_id =mn.id
        where 1=1 
        and mn.user_id = ?
        `
        
        const userNoteTags = await database.all(sql, [user_id])
        res.json(userNoteTags)
    }

    async update(req, res) {
        const {user_id} = req.usuario
        const {title, description, rating} = req.body
        const {note_id} = req.params

        const database = await sqliteConn()
        const noteFound = await database.get(`select * from movie_notes where id = ? and user_id = ?`, 
            [note_id, user_id])
        
        if(!noteFound) {
            throw new errorHandler("Nota não existe.")
        }

        const newTitle = title ?? noteFound.title
        const newDescription = description ?? noteFound.description
        const newRating = rating ?? noteFound.rating

        await database.run(`update movie_notes 
                            set title = ?, description = ?, rating = ?, updated_at = datetime() 
                            where id = ?`,
            [newTitle, newDescription, newRating, note_id])
        
        const updatedRegister = await database.all(`select * from movie_notes where id = ?`, [note_id])
        res.json(updatedRegister)
    }
}



module.exports = {notes_controller}
