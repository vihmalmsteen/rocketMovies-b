/**
 * Configuracões do JSON Web Token (JWT)
 * 
 * @prop {string} secret - Segredo para gerar o token. Deve ser um valor
 *                         único e secreto. Por padrão, se informa 'default'.
 * @prop {string} expiresIn - Tempo de vida do token, ou seja, o tempo que ele
 *                           permanece válido. O valor deve ser em segundos,
 *                           minutos, horas ou dias. Ex.: '1h', '2d', etc.
 */

const jwtConfig = {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: process.env.AUTH_EXPIRATION || "10d"
}

module.exports = {jwtConfig}