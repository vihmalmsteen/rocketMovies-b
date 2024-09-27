const {verify} = require('jsonwebtoken')
const {jwtConfig} = require('../configs/jwt')


/**
 * Middleware responsavel por autenticar a requisicao.
 * 
 * Ele verifica se o token de autenticacao esta presente no header da requisicao
 * e se ele é valido.
 * Se o token for valido, o middleware extrai o id do usuario do token
 * e coloca na propriedade "id" do objeto "request".
 * Se o token for invalido, o middleware retorna um status de 401
 * com um objeto de erro.
 * 
 * @param {Request} request - Requisicao
 * @param {Response} response - Resposta
 * @param {NextFunction} next - Funcao para encaminhar a requisicao
 */
function authenticate(request, response, next) {
    const {authorization} = request.headers              // isso aqui é default do header

    if (!authorization) {
        return response.status(401).json({error: 'Token de autenticação ausente.'})
    }

    // A variavel authorization vem com o formato "Bearer <token>".
    // Portanto, estamos usando o metodo split para dividir a string em dois pedacos
    // e pegando o segundo pedaco, que é o token em si.
    // O primeiro pedaco é descartado, por isso o uso de _, que é uma variavel
    // especial em JavaScript que significa "nao usei essa variavel".
    const [, token] = authorization.split(' ')

    try {
        // A funcao verify do jsonwebtoken verifica se o token é valido e, se for, retorna um objeto 
        // com as informacoes do payload do token.
        // Nesse caso, estamos interessados apenas na propriedade "sub", que é o id do usuario que gerou o token.
        // Portanto, estamos desestruturando o objeto retornado e pegando apenas a propriedade "subject".
        const {sub} = verify(token, jwtConfig.secret)

        // Criando a propriedade "request.usuario.user_id" para armazenar o id do usuario.
        // Isso fará com que o middleware de autenticação possa acessar o id do usuario nesta propriedade.
        // A conversão em Number é feita porque o valor da propriedade "subject" é uma string. E no DB é integer.
        request.usuario = {
            user_id: Number(sub)
        }

        return next()
    } catch (error) {
        return response.status(401).json({error: 'Token de autenticação inválido.'})
    }
}

module.exports = {authenticate}


