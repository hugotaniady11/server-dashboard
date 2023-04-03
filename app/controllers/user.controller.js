const db = require('../models')
const User = db.users
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  const { email, username, account_type, password } = req.body

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
    email: email,
    username: username,
    account_type: account_type,
    password: hashedPassword
  })


  const accessToken = jwt.sign(
    { id: registeredUser._id, email: registeredUser.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  );

  registeredUser.accessToken = accessToken;
  await registeredUser.save();



  res.status(201).json({
    message: "User registered!",
    accessToken: accessToken
  })

}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const findUser = await User.findOne({
    email
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

  const accessToken = jwt.sign(
    { userId: findUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  );

  const refreshToken = jwt.sign(
    { userId: findUser._id, email: findUser.email, username: findUser.username },
    process.env.ACCESS_TOKEN_SECRET
  );

  // save refresh token to database
  findUser.refreshToken = refreshToken;
  await findUser.save();

  res.status(200).json({
    message: "User logged in",
    accessToken,
    refreshToken

  });
};

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

exports.generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '1h' }
  );
  return { token, refreshToken };
};

exports.profile = async (req, res) => {
  const user = {
    userId : req.user._id,
    username: req.user.username,
    email: req.user.email,
    account_type: req.account_type
  };

  res.json(user);
}

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    user.refreshToken = null;
    await user.save();
    // perform logout actions
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}