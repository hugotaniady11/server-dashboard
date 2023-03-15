module.exports = (app) => {
    const members = require('../controllers/member.controller')
    const router = require('express').Router()


    // Route for creating a new member
    router.post('/', members.createMember);

    // Route for retrieving all members
    router.get('/', members.getMembers);
    // Route for retrieving a single member by ID
    router.get('/:id', members.getMemberById);

    // Route for updating a member by ID
    router.put('/:id', members.updateMemberById);

    // Route for deleting a member by ID
    router.delete('/:id', members.deleteMemberById);


    app.use('/api/members', router)
}