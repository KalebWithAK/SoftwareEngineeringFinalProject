const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes')

const app = express()
const port = 3001

// Parse request bodies as JSON
app.use(express.json())
// Allow access from different origins
app.use(cors())
// Include routes
app.use(routes)

// Start API server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${ port }`)
})
