const {tags_controller} = require('../controllers/tags_controller')
const tags_router = require('express').Router()
const {authenticate} = require('../middlewares/authenticate')

const tagsController = new tags_controller()


tags_router.post('/create/:note_id', authenticate, tagsController.create)
tags_router.get('/read', authenticate, tagsController.read)
tags_router.put('/update/:tag_id', authenticate, tagsController.update)
tags_router.delete('/delete/:tag_id', authenticate, tagsController.delete)



module.exports = {tags_router}

