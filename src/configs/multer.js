const path = require('path')
const multer = require('multer')        // lib de upload
const crypto = require('crypto')        // do bcrypt gera hash aleatoria pra garantir q cada user tenha uma pasta unica pra uma nao sobrepor outra quando criada


const tmp_folder = path.resolve(__dirname, '..', '..', 'tmp')
const uploads_folder = path.resolve(tmp_folder, 'uploads')

const Multer = {
    storage: multer.diskStorage({
        destination: tmp_folder,
        filename: (req, file, cb) => {
            const fileHash = crypto.randomBytes(10).toString('hex')
            const fileName = `${fileHash}-${file.originalname}`

            return cb(null,fileName)
        }
    })
}


module.exports = { Multer, tmp_folder, uploads_folder }

