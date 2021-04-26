const mysql = require('promise-mysql')

function create_pool(address, port, username, password, dbname) {
    return mysql.createPool({
        connectionLimit : 10,
        host : address,
        port: port,
        user : username,
        password : password,
        database : dbname,
    })
}

// Attempts to make a connection to thw MySQL database whose information has
// been defined in `process.env`
module.exports.make_pool = () => {
    const dbAddress = process.env.MYSQL_DB_ADDRESS
    const dbPort = process.env.MYSQL_DB_PORT
    const dbUser = process.env.MYSQL_DB_USERNAME
    const dbPass = process.env.MYSQL_DB_PASSWORD
    const dbName = process.env.MYSQL_DB_NAME

    return create_pool(dbAddress, dbPort, dbUser, dbPass, dbName)
}
