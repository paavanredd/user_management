const express = require('express')
const router = require('./routers/user_routes')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router)


app.listen(port, () => {
    console.log(`Server is up and running on port : ${port}`)
})