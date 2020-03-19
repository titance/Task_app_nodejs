const express = require("express")
require('./db/mongoose')
const userroute = require('./routers/userroute')
const taskroute = require('./routers/taskroute')


const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.send("Site Under maintainance mode ")

// })




// app.post('/upload', upload.single('upload'), (req, res) => {

//     res.send()
// })


app.use(express.json())
app.use(userroute)
app.use(taskroute)


app.listen(port, () => {
    console.log("server is on port ", port)

})