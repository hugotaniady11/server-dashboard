const db = require('../models')
const User = db.users
const bcrypt = require("bcrypt")

exports.register = async (req,res) => {
    const { email, username, password } = req.body

    const findUser = await User.findOne({
        username
    })

    if (findUser) {
        return res.status(400).json({
            message: "Username has been taken"
        })
    }

    //password
    const hashedPassword = bcrypt.hashSync(password, 5);

    await User.create({
        email : email,
        username : username,
        password: hashedPassword
    })

    res.status(201).json({
        message: "User registered!"
    })

}

exports.login = async (req,res) => {
    const { username, password } = req.body

    const findUser = await User.findOne({
        username
    })

    if (!findUser) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    //password
    const isPasswordValid = bcrypt.compareSync(password, findUser.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Wrong Password"
        })
    }

    return res.status(200).json({
        message: "User logged in",
        data: findUser,
    });
};