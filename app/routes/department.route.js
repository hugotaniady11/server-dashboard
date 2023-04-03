module.exports = (app) => {
    const departments = require('../controllers/department.controller')
    const router = require('express').Router()

    router.post('/department', departments.createDepartment)
    router.get('/department', departments.getDepartment)
    
    

    app.use('/api', router)
}