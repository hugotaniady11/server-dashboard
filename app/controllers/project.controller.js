const db = require('../models')
const Project = db.projects

exports.findAll = (req,res) => {
    Project.find()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message
            })
        });
}

exports.findOne = (req,res) => {
    Product.findOne({
        code: req.params.id
    })
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(409).send({
                message: err.message || "Some error while retrieving products."
            })
        });
}