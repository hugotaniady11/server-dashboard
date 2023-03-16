module.exports = (app) => {
    const resources = require('../controllers/resource.controller')
    const router = require('express').Router()


    router.post('/', resources.createResource);
    router.get('/', resources.getResources);
    router.get('/:id', resources.getResourceById);
    router.put('/:id', resources.updateResourceById);
    router.delete('/:id', resources.deleteResourceById);


    app.use('/api/resources', router)
}