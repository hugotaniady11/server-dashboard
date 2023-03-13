const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/', (req,res) => {
    res.json({
        message: 'Welcome to server'
    })
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
