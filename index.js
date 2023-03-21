const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require("cors")
const corsOptions ={
    origin:'*', 
    credentials:true,    
    optionSuccessStatus:200,
 }
const app = express()
const path = require('path')
require('dotenv').config();
const PORT = process.env.PORT || 8000

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}))

const db = require('./app/models');
db.mongoose.set("strictQuery", false);
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((res)=> {
        console.log('Database connected')
    }).catch((err) => {
        console.log("Cannot connect to database!", err)
        process.exit()
    })

    
app.get('/', (req,res) => {
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

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
