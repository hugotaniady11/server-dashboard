const db = require('../models')
const Department = db.departments

exports.createDepartment = async (req, res) => {
    try {

        const { department_id, name } = req.body

        const existingDepartment = await Department.findOne({
            $or: [{ department_id }, { name }],
        });

        if (existingDepartment) {
            return res.status(400).json({ error: 'Department has been made' });
        }

        const newDepartment = new Department({
            department_id, name
        });

        await newDepartment.save();

        res.status(201).json({ message: 'Department created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }

}

exports.getDepartment = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

}

