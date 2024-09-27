const compare = require('bcryptjs').compare
const sign = require('jsonwebtoken').sign  // gera um token para o usuario que logou com sucesso a partir do seu id.
const {sqliteConn} = require('../database/db_connection')
const {jwtConfig} = require('../configs/jwt')


class SessionsController {
        /**
         * Autentica um user na API
         *
         * @param {Request} request - Request do Express
         * @param {Response} response - Response do Express
         *
         * @returns {Promise<void>}
         */
    async create(request, response) {
        const {email, password} = request.body

        const database = await sqliteConn()
        const user = await database.get('select * from users where email = ?', [email])

        if (!user) {
            throw new Error("Email ou senha inválidos");   
        }

        const passwordComparison = await compare(password, user.password)

        if (!user || !passwordComparison) {
            throw new Error("Email ou senha inválidos");
        }

        // Gera um token para autenticar o usuario
        // O token eh assinado com o segredo do jwt (secret) e tem um tempo de vida
        // definido pelo expiresIn. O payload do token eh composto pelo id do usuario,
        // que sera usado para autenticar o usuario em futuras requisicoes
        const {secret, expiresIn} = jwtConfig
        const token = sign({}, secret, {
            subject: String(user.id), // payload do token
            expiresIn: expiresIn // tempo de vida do token
        })

        return response.json({user, token})
    }
}

module.exports = {SessionsController}

