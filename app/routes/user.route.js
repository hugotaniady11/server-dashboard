module.exports = (app) => {
    const users = require('../controllers/user.controller')
    const router = require('express').Router()

    router.post('/register', users.register)
    router.post('/login', users.login)
    router.post('/logout', users.authMiddleware, users.logout)
    
    

    app.use('/api', router)
}