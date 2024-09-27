const {Router} = require('express')
const {SessionsController} = require('../controllers/sessionsController')

const sessions_routes = Router()
const sessionsController = new SessionsController()


// sessions_routes.post('/sessions', sessionsController.create)
sessions_routes.use('/create', sessionsController.create)

module.exports = {sessions_routes}

