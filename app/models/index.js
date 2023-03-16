const dbConfig = require('../../config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.users = require('./user.model')(mongoose)
db.projects = require('./project.model')(mongoose)
db.members = require('./member.model')(mongoose)
db.resources = require('./resource.model')(mongoose)

module.exports = db