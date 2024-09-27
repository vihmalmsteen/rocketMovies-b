const {Router} = require('express')
const {notes_controller} = require('../controllers/notes_controller')
const {authenticate} = require('../middlewares/authenticate')

const notes_routes = Router()
const notesController = new notes_controller()

notes_routes.post('/create', authenticate, notesController.create)
notes_routes.delete('/delete/:note_id', authenticate, notesController.delete)
notes_routes.get('/read/', authenticate, notesController.read)
notes_routes.get('/readtags/', authenticate, notesController.readTags)
notes_routes.put('/update/:note_id', authenticate, notesController.update)



module.exports = {notes_routes}


