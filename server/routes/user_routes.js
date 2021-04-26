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

module.exports.create_user = (dbpool) => async (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({
            error: 'Missing email and/or password in JSON request body',
        })
        return;
    }

    let email = req.body.email
    let password = req.body.password

    // Check if the email is already linked to an account
    if (await dbuser.email_is_taken(dbpool, email)) {
        res.json({
            error: 'Email already taken',
        })
        return;
    }

    // Try to register the user
    if (await dbuser.register_user(dbpool, email, password)) {
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
        return;
    }

    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({
            error: "Missing email and/or password in JSON request body",
        })
        return;
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
