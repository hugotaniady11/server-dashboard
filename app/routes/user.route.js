module.exports = (app) => {
    const users = require('../controllers/user.controller')
    const router = require('express').Router()

    router.post('/register', users.register)
    router.post('/login', users.login)
    router.delete('/logout', users.logout)
    router.get('/profile', users.authMiddleware, users.profile)
    
    

    app.use('/api', router)
}