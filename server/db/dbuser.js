const crypto = require('crypto')

// Check whether the given email is taken given some queriable object
module.exports.email_is_taken = async (dbconn, email) => {
    try {
        let results = await dbconn.query('SELECT COUNT(*) FROM `user` WHERE `email`=?', [email])
        return results.length > 0 && parseInt(results[0]['COUNT(*)']) > 0
    } catch (e) {
        console.error('Failed to check if email was taken:')
        console.error(e)
    }
    return false
}

// Tries to create a user account and returns a boolean based on whether it was
// successful
module.exports.register_user = async (dbconn, email, name, password) => {
    // Create the user's password hash
    let { hash, salt } = create_password_hash(password)

    try {
        const sql = 'INSERT INTO `user` (email, name, password_hash, password_salt, updated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
        let results = await dbconn.query(sql, [email, name, hash, salt])
        return true
    } catch (e) {
        console.error('Failed to register user:')
        console.error(e)
    }
    return false
}

// Tries to create a session with the provided login information
module.exports.try_login = async (dbconn, email, password) => {
    try {
        const sql = 'SELECT `id`, `password_hash`, `password_salt`, `deleted` FROM `user` WHERE `email`=?'
        let results = await dbconn.query(sql, [email])
        if (results.length > 0) {
            let r = results[0]
            if (r.deleted) {
                return {
                    error: 'Account deleted',
                }
            }
            return create_session(dbconn, email, password, r['id'], r['password_hash'], r['password_salt'])
        }
    } catch (e) {
        console.error('Failed to get user password hash and/or salt:')
        console.error(e)
        return {
            error: e,
        }
    }
    return {
        error: 'Login failed'
    }
}

async function create_session(dbconn, email, password, user_id, password_hash, password_salt) {
    if (verify_password_hash(password_hash, password_salt, password)) {
        try {
            const sql = 'INSERT INTO `session` (session_key, user_id) VALUES (?, ?)'
            let session_key = crypto.randomBytes(16).toString('hex')
            await dbconn.query(sql, [session_key, user_id])
            return {
                session: session_key,
            }
        } catch (e) {
            console.error('Failed to create session:')
            console.error(e)
            return {
                error: e,
            }
        }
    } else {
        return {
            error: 'Incorrect password',
        }
    }
    return {
        error: 'Session creation failed'
    }
}

module.exports.verify_session = async (dbconn, session_key) => {
    try {
        const sql1 = 'SELECT COUNT(*) FROM `session` WHERE `session_key`=? AND `expired`=0'
        let results1 = await dbconn.query(sql1, [session_key])
        if (results1.length > 0 && parseInt(results1[0]['COUNT(*)']) > 0) {
            // Get user ID from the session key
            let user_id = await module.exports.session_user_id(dbconn, session_key)
            if (user_id >= 0) {
                // Make sure user account still exists
                let results2 = await dbconn.query('SELECT `deleted` FROM `user` WHERE `id`=?', [user_id])
                return results2.length > 0 && !results2[0].deleted
            }
        }
    } catch (e) {
        console.error('Failed to verify session:')
        console.error(e)
    }
    return false
}

module.exports.session_user_id = async (dbconn, session_key) => {
    try {
        const sql = 'SELECT `user_id` FROM `session` WHERE `session_key`=? AND `expired`=0'
        let results = await dbconn.query(sql, [session_key])
        return results.length > 0 && results[0].user_id
    } catch (e) {
        console.error('Failed to verify session:')
        console.error(e)
    }
    return -1
}

module.exports.is_admin = async (dbconn, session_key) => {
    try {
        const sql = 'SELECT user.admin FROM (`user` INNER JOIN `session` ON user.id=session.user_id) WHERE session.session_key=?'
        let results = await dbconn.query(sql, [session_key])
        return results.length > 0 && results[0].admin
    } catch (e) {
        console.error('Failed to verify admin status:')
        console.error(e)
    }
    return false
}

module.exports.deauth = async (dbconn, session_key) => {
    try {
        const sql = 'UPDATE `session` SET `expired`=1 WHERE `session_key`=?'
        await dbconn.query(sql, [session_key])
        return true
    } catch (e) {
        console.error('Failed to verify session:')
        console.error(e)
    }
    return false
}

// Utility functions

function sha512(password, salt, iterations=1000) {
    return crypto.pbkdf2Sync(password, salt, iterations, 64, `sha512`).toString(`hex`)
}

function create_password_hash(password) {
    // Generate a random salt for this password (32 digit hex)
    let salt = crypto.randomBytes(16).toString('hex')

    // Generate the password hash with 1000 iterations and a 64 byte long key
    // using the sha512 algorithm (once again to hex string)
    let hash = sha512(password, salt)

    return {
        salt: salt,
        hash: hash,
    }
}

function verify_password_hash(hash, salt, password) {
    return hash === sha512(password, salt)
}
