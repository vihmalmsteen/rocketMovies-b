const users_router = require('express').Router()
const {user_controller} = require('../controllers/users_controller')
const {userAvatarController} = require('../controllers/avatar_controller')
const {authenticate} = require('../middlewares/authenticate')
const multer = require('multer')
const {Multer} = require('../configs/multer')

const usersController = new user_controller()
const UserAvatarController = new userAvatarController()
const upload = multer(Multer)

users_router.use('/create', usersController.create)
users_router.use('/update', authenticate, usersController.update)
users_router.use('/delete/:user_id', authenticate, usersController.delete)              // authenticate fará diferença no insomnia (vai ter q gerar token na session)
users_router.use('/querying/:user_id', authenticate, usersController.querying)          // authenticate fará diferença no insomnia (vai ter q gerar token na session)
users_router.patch('/avatar', authenticate, upload.single('avatar'), UserAvatarController.update)

module.exports = {users_router}