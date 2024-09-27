const errorHandler = require('../utils/errorHandler')
const {diskStorage} = require('../providers/diskStorage')
const {sqliteConn} = require('../database/db_connection')

class userAvatarController {
    async update(req, res) {
        const {user_id} = req.usuario
        
        const avatarFilename = req.file.filename
        const DiskStorage = new diskStorage()
        const database = await sqliteConn()
        
        const user = await database.get('select * from users where id = ?', [user_id])
        
        if(!user) {
            throw new errorHandler("Somente users autenticados mudam foto do perfil.", 401)
        }
        
        if(user.avatar) {
            await DiskStorage.deleteFile(user.avatar)
        }
        
        const filename = await DiskStorage.saveFile(avatarFilename)
        user.avatar = filename;
        
        await database.run('update users set avatar = ? where id = ?', [user.avatar, user_id])
        const updatedUser = await database.get('select * from users where id = ?', [user_id])
        return res.json(updatedUser)
    }
}


module.exports = {userAvatarController}