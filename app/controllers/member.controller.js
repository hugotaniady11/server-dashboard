const db = require('../models')
const Member = db.members
const Project = db.projects
const path = require('path')
const fs = require('fs')

// const generateMemberId = () => {
//     const id = Math.floor(Math.random() * 10000); // generate a random number between 0 and 9999
//     return id.toString().padStart(4, '0'); // pad the number with leading zeros until it reaches 4 digits
//   };

exports.createMember = async (req, res) => {
    try {
        let member_id;
        do {
            member_id = Math.floor(Math.random() * 10000);
        } while (await Member.findOne({ member_id }));

        const { name, email, jobTitle, department } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file.path;

        const existingMember = await Member.findOne({
            $or: [{ email }, { name }],
        });

        if (existingMember) {
            return res.status(400).json({ error: 'Email or name already taken' });
        }

            const newMember = new Member({
                member_id,
                name,
                email,
                jobTitle,
                department,
                file,
            });

            await newMember.save();

            res.status(201).json({ message: 'Member created', data: { member_id, name, email, jobTitle, department, file } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find().populate("project_manager");
        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

};

exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findOne({ member_id: req.params.member_id }).populate("project_manager");

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateMemberById = async (req, res) => {
    try {
        const { member_id } = req.params;
        const { name, email, jobTitle, department } = req.body;

        // Find the member by ID and update their information
        const updatedMember = await Member.findOneAndUpdate(
            { member_id },
            { name, email, jobTitle, department, file: req.file.path },
            { new: true }
        );

        // If the member is not found, return a 404 error response
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        const { _id, ...memberData } = updatedMember._doc;
        const response = {
            member_id: memberData.member_id,
            name: memberData.name,
            email: memberData.email,
            jobTitle: memberData.jobTitle,
            department: memberData.department,
            file: memberData.file,
        };


        // If the member is found and updated successfully, return a success response
        return res.json({ message: 'Member updated successfully.', data: response });
    } catch (error) {
        // If there's an error, return a 500 error response
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteMemberById = async (req, res) => {
    const memberId = req.params.member_id;
    // const file = req.file.path;

    try {
        const deletedMember = await Member.findOneAndDelete({ member_id: memberId });

        if (!deletedMember) {
            return res.status(404).json({ message: `Member with ID ${memberId} not found` });
        }
        removeFile(deletedMember.file);
        return res.json({ message: `Member with ID ${memberId} successfully deleted` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const removeFile = (filePath) => {
    filePath = path.join(__dirname, '../..' , filePath);
    fs.unlink(filePath, err => {console.log(err)});
}