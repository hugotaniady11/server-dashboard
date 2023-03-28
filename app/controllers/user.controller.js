const db = require('../models')
const User = db.users
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

exports.register = async (req,res) => {
    const { email, username, password } = req.body

    const findUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (findUser) {
        return res.status(400).json({
            message: "Email or Username has been taken"
        })
    }

    //password
    const hashedPassword = bcrypt.hashSync(password, 5);

    const registeredUser = await User.create({
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
        return res.status(401).json({
            message: "User not found"
        })
    }

    //password
    const isPasswordValid = bcrypt.compareSync(password, findUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Wrong Password"
        })
    }

    // return res.status(200).json({
    //     message: "User logged in",
    //     data: findUser,
    // });

    const accessToken = jwt.sign(
        { userId: findUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
      );
      
  
      res.status(200).json({ 
        message: "User logged in",
        token: accessToken
    });
};

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


  exports.logout = async (req,res) => {
    try {
        const user = req.user;
        // perform logout actions
        res.status(200).json({ message: 'Logout successful' });
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
  }