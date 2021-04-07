const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${ port }`)
})