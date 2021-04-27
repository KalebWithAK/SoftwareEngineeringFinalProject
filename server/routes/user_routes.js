const dbuser = require('../db/dbuser')

// Middleware that requires valid authentication before continuing
module.exports.auth_required = (dbpool) => async (req, res, next) => {
    if (!req.body || !req.body.session_key) {
        res.json({
            error: 'Missing session key in JSON body',
        })
        return
    }

    if (!(await dbuser.verify_session(dbpool, req.body.session_key))) {
        res.json({
            error: 'Invalid or expired session key',
        })
        return
    }

    next()
}

module.exports.admin_required = (dbpool) => async (req, res, next) => {
    if (!(await dbuser.is_admin(dbpool, req.body.session_key))) {
        res.json({
            error: 'Insufficient permissions',
        })
        return
    }

    next()
}

module.exports.logout = (dbpool) => async (req, res) => {
    if (await dbuser.deauth(dbpool, req.body.session_key)) {
        res.json({
            success: true
        })
    } else {
        res.json({
            error: 'Failed to deauthorize session key',
        })
    }
}

module.exports.list_users = (dbpool) => async (req, res) => {
    try {
        let results = await dbpool.query('SELECT `id`, `email`, `name`, `admin`, `created`, `updated` FROM `user`')
        res.json({
            users: results.map(user => {
                return {
                    user_id: user.id,
                    email: user.email,
                    name: user.name,
                    is_admin: !!user.admin,
                    created_timestamp: user.created,
                    updated_timestamp: user.updated,
                }
            }),
        })
        return
    } catch (e) {
        console.error('Failed to get users:')
        console.error(e)
    }
    res.json({
        error: 'Failed to get user list'
    })
}

module.exports.create_user = (dbpool) => async (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.name || !req.body.password) {
        res.json({
            error: 'Missing email, password, and/or name in JSON request body',
        })
        return;
    }

    let email = req.body.email
    let name = req.body.name
    let password = req.body.password

    // Check if the email is already linked to an account
    if (await dbuser.email_is_taken(dbpool, email)) {
        res.json({
            error: 'Email already taken',
        })
        return;
    }

    // Try to register the user
    if (await dbuser.register_user(dbpool, email, name, password)) {
        res.json({
            success: true,
        })
        return;
    }

    res.json({
        error: 'Failed to register user',
    })
}

module.exports.login = (dbpool) => async (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({
            error: "Missing email and/or password in JSON request body",
        })
        return
    }

    let email = req.body.email
    let password = req.body.password

    // Try to get the session
    let session = await dbuser.try_login(dbpool, email, password)
    if (!!session.session) {
        res.json({
            session_key: session,
        })
        return;
    } else if (!!session.error) {
        if (!!session.error.message) {
            console.error('Failed to try to login')
            console.error(session.error.message)
        } else {
            res.json({
                error: session.error,
            })
            return
        }
    }

    res.json({
        error: 'Failed to login with the provided credentials',
    })
}

module.exports.delete_user = (dbconn) => async (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.user_id) {
        res.json({
            error: 'Missing user ID',
        })
        return
    }

    // Get current user's id
    let current_user_id = await dbuser.session_user_id(dbconn, req.body.session_key)
    if (current_user_id < 0) {
        res.json({
            error: 'Failed to get current user ID'
        })
        return
    }

    // Make sure current user isn't deleting themselves
    if (req.body.user_id == current_user_id) {
        res.json({
            error: 'Cannot delete self'
        })
        return
    }

    try {
        // Delete the specified user
        await dbconn.query('UPDATE `user` SET `deleted`=TRUE, `updated`=CURRENT_TIMESTAMP WHERE `id`=?', [req.body.user_id])
        res.json({
            success: true,
        })
        return
    } catch (e) {
        console.error(`Failed to delete user ${req.body.user_id}:`)
        console.error(e)
    }
    res.json({
        "error": "Failed to delete user"
    })
}
