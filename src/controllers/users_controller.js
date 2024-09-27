const {compare, hash} = require('bcryptjs')
const {sqliteConn} = require('../database/db_connection')
const errorHandler = require('../utils/errorHandler')




class user_controller {
    
    /* create-> cria usuario */
    async create(req, res) {
        const {name, email, password} = req.body
        const hashedPass = await hash(password, 8)

        const database = await sqliteConn()
        
        const emailValidation = await database.get(`select * from users where email = (?)`, [email])

        if(emailValidation) {
            throw new errorHandler("Email em uso.");
        }

        if (!name || !email || !password) {
            throw new errorHandler("Nome, email e senha devem ser informados.");
        }

        await database.run(`
            insert into users (name, email, password) values
            ( ? , ? , ? )`, [name, email, hashedPass])
        
        await res.send('User criado.')
    }

    
    /* consulta-> consultar usuario */
    async querying(req, res) {
        const {user_id} = req.params
        const database = await sqliteConn()
        const consulta = await database.all('select * from users where id = ?', [user_id])
        await res.json(consulta)
    }


    
    async update(req, res) {

        const {user_id} = req.usuario             // vem do middleware de autenticacao, que checa se o token é valido
        const {name, email, password} = req.body

        const database = await sqliteConn()
        const user = await database.get(`select * from users where id = (?)`, [user_id])
        const userWithExistingEmail = await database.get(`select * from users where email = (?)`, [email])
        
        if(!user) {
            throw new errorHandler("Usuário não encontrado.");
        }

        if(userWithExistingEmail && userWithExistingEmail.id != user_id) {
            throw new errorHandler("Email em uso.")
        }
        
        const nameFinal = name || user.name
        const emailFinal = email || user.email
        const passwordFinal = password ? await hash(password, 8) : user.password;

        await database.run(`update users set name = ?, email = ?, password = ?, updated_at = datetime() where id = ?`, 
            [nameFinal, emailFinal, passwordFinal, user_id])
            
            await res.send('User atualizado.')
    }

    async delete(req, res) {
        const {user_id} = req.params
        const database = await sqliteConn()

        const foundUser = await database.get('select * from users where id = ?', [user_id])
        if(!foundUser) {
            throw new errorHandler("User não encontrado.");
        }

        await database.run('delete from users where id = ?', [user_id])
        await res.send('User deletado.')
    }

}




module.exports = {user_controller}

