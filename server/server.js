const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const dbconn = require('./db/dbconn')

const port = 3001

// Load .env properties into `process.env` and ensure required ones are present
dotenv.config()
if (!process.env.MYSQL_DB_ADDRESS
        || !process.env.MYSQL_DB_PORT
        || !process.env.MYSQL_DB_USERNAME
        || !process.env.MYSQL_DB_PASSWORD
        || !process.env.MYSQL_DB_NAME) {
    console.error('Missing required MySQL database environment variables!')
    console.error('Please see the README.md file for how to create and populate the .env file')
    console.error('Exiting!')
    // Exit!
    return
}
console.log('Loaded .env properties file')

// Create pool of database connections
const dbpool = dbconn.make_pool()
        // Start the server with this connection pool
        .then((db) => {
            // Routes require access to the database
            const routes = require('./routes/routes')(db)

            // Create Express app
            const app = express()

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
        })
        .catch((e) => {
            throw e
        })
