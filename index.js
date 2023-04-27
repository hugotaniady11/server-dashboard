const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require("cors")
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
const app = express()
const path = require('path')
require('dotenv').config();
const PORT = process.env.PORT || 8000
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
  // destination: function(req, file, cb) {
  //   let dest;
  //   if (file.mimetype === 'application/pdf') {
  //     dest = 'files';
  //   } else if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
  //     dest = 'images';
  //   } else {
  //     return cb(new Error('Unsupported file type'))
  //   }
  //   cb(null, dest)
  // },
  // filename: function(req, file, cb) {
  //   cb(null, new Date().getTime() + '-' + file.originalname);
  // }
});

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use('/files', express.static(path.join(__dirname, 'files')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('file'));
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

const db = require('./app/models');
db.mongoose.set("strictQuery", false);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log('Database connected')
  }).catch((err) => {
    console.log("Cannot connect to database!", err)
    process.exit()
  })


app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Welcome to server'
  })
})

require('./app/routes/user.route')(app)
require('./app/routes/member.route')(app)
require('./app/routes/project.route')(app)
require('./app/routes/resource.route')(app)
require('./app/routes/invoice.route')(app)
require('./app/routes/department.route')(app)

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})
