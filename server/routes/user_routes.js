module.exports.create_user = (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({
            error: "Missing email and/or password in JSON request body",
        })
        return;
    }

    // TODO: CHECK IF EMAIL IS TAKEN

    // TODO: RETURN SUCCESS
}

module.exports.login = (req, res) => {
    // Make sure required info is present
    if (!req.body || !req.body.email || !req.body.password) {
        res.json({
            error: "Missing email and/or password in JSON request body",
        })
        return;
    }

    // TODO: TRY TO LOGIN
}
