const db = require('../models')
const Member = db.members

// const generateMemberId = () => {
//     const id = Math.floor(Math.random() * 10000); // generate a random number between 0 and 9999
//     return id.toString().padStart(4, '0'); // pad the number with leading zeros until it reaches 4 digits
//   };

exports.createMember = async (req, res) => {
    try {
        let id;
        do {
            id = Math.floor(Math.random() * 10000);
        } while (await Member.findOne({ id }));

        const { name, email, jobTitle, department } = req.body

        const existingMember = await Member.findOne({
            $or: [{ email }, { name }],
        });

        if (existingMember) {
            return res.status(400).json({ error: 'Email or name already taken' });
        }

        const newMember = new Member({
            id,
            name,
            email,
            jobTitle,
            department,
        });

        await newMember.save();

        res.status(201).json({ message: 'Member created', data: { id, name, email, jobTitle, department } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        const formattedMembers = members.map((member) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            jobTitle: member.jobTitle,
            department: member.department,
        }));
        res.status(200).json(formattedMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

};

exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findOne({ id: req.params.id });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        const { name, email, jobTitle, department } = member;
        res.status(200).json({ id: req.params.id, name, email, jobTitle, department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, jobTitle, department } = req.body;

        // Find the member by ID and update their information
        const updatedMember = await Member.findOneAndUpdate(
            { id },
            { name, email, jobTitle, department },
            { new: true }
        );

        // If the member is not found, return a 404 error response
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        const { _id, ...memberData } = updatedMember._doc;
        const response = {
            id: memberData.id,
            name: memberData.name,
            email: memberData.email,
            jobTitle: memberData.jobTitle,
            department: memberData.department,
        };


        // If the member is found and updated successfully, return a success response
        return res.json({ message: 'Member updated successfully.', data: response });
    } catch (error) {
        // If there's an error, return a 500 error response
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteMemberById = async (req, res) => {
    const memberId = req.params.id;

    try {
        const deletedMember = await Member.findOneAndDelete({ id: memberId });

        if (!deletedMember) {
            return res.status(404).json({ message: `Member with ID ${memberId} not found` });
        }

        return res.json({ message: `Member with ID ${memberId} successfully deleted` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};