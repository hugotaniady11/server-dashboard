module.exports = (app) => {
    const projects = require('../controllers/project.controller')
    const router = require('express').Router()

    
    router.get('/', projects.findAll)
    router.get('/:id', projects.findOne)
    

    app.use('/api/projects', router)
}