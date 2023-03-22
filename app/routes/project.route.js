module.exports = (app) => {
    const projects = require('../controllers/project.controller')
    const router = require('express').Router()

    
    router.get('/', projects.getProjects)
    router.get('/:project_id', projects.getProjectById)
    router.put('/:project_id', projects.updateProjectById)
    router.delete('/:project_id', projects.deleteProjectById)
    router.post('/', projects.createProject)
    

    app.use('/api/projects', router)
}