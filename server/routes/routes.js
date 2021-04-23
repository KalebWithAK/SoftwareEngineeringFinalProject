const category_routes = require('./category_routes')
const post_routes = require('./post_routes')
const user_routes = require('./user_routes')

const express = require('express')
const router = express.Router()

// User routes
router.get('/api/user/register', user_routes.create_user)

module.exports = router
