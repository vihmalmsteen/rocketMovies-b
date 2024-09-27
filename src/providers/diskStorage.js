const fs = require("fs")
const path = require("path")
const {tmp_folder, uploads_folder} = require('../configs/multer')


class diskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            path.resolve(tmp_folder, file),            // aonde o file está
            path.resolve(uploads_folder, file),        // aonde o file irá
        )
        return file
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploads_folder, file)
        console.log('filePath: \n', filePath)
        try {
            await fs.promises.stat(filePath)
        } catch {
            return
        }
        
        await fs.promises.unlink(filePath)        // deleta o arquivo

    }
}



module.exports = {diskStorage}