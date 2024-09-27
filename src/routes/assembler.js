const {users_router} = require('./user_routes')
const {notes_routes} = require('./notes_routes')
const {tags_router} = require('./tags_routes')
const {sessions_routes} = require('./sessions_routes')

const assembled_routes = require('express').Router()


assembled_routes.use('/users', users_router)
assembled_routes.use('/notes', notes_routes)
assembled_routes.use('/tags', tags_router)
assembled_routes.use('/sessions', sessions_routes)


module.exports = {assembled_routes}


