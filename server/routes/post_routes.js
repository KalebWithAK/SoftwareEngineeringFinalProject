const dbuser = require('../db/dbuser')
const dbpost = require('../db/dbpost')

module.exports.create_post = (dbconn) => async (req, res) => {
    // Check for missing information
    if (!req.body.category_id || !req.body.title || !req.body.content) {
        res.json({
            error: 'Missing post category id, title, and/or content',
        })
        return
    }

    // Get the ID of the creator
    let creator_id = await dbuser.session_user_id(dbconn, req.body.session_key)
    if (creator_id < 0) {
        res.json({
            error: 'Failed to check creator id',
        })
        return
    }

    // Make sure title is unique
    if (await dbpost.post_exists(dbconn, req.body.title)) {
        res.json({
            error: 'Post title already taken',
        })
        return
    }

    // Make sure category exists
    if (!(await dbcat.get_category_from_id(dbconn, req.body.category_id))) {
        res.json({
            error: 'Category not found',
        })
        return
    }

    try {
        // Insert the new post
        const sql = 'INSERT INTO `post` (creator_id, category_id, title, content, updated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
        let results = await dbconn.query(sql, [
            creator_id,
            req.body.category_id,
            req.body.title,
            req.body.content,
        ])
        res.json({ post_id: results.insertId, })
        return
    } catch (e) {
        console.error('Failed to create post:')
        console.error(e)
    }
    res.json({
        error: 'Failed to create post'
    })
}

module.exports.update_post = (dbconn) => async (req, res) => {
    // Make sure post_id is provided
    if (!req.body.post_id) {
        res.json({
            error: 'Missing post id',
        })
        return
    }

    // Make sure post_id is valid
    if (!dbpost.get_post_from_id(dbconn, req.body.post_id)) {
        res.json({
            error: 'Post not found',
        })
        return
    }

    // Check if all optionals are missing
    if (!req.body.category_id && !req.body.title && !req.body.content) {
        res.json({
            error: 'Missing post category id, title, and/or content (at least one is required)',
        })
        return
    }

    // Get the ID of the creator
    let creator_id = await dbuser.session_user_id(dbconn, req.body.session_key)
    if (creator_id < 0) {
        res.json({
            error: 'Failed to check creator id',
        })
        return
    }

    // Make sure title is unique
    if (!!req.body.title && await dbpost.post_exists(dbconn, req.body.title)) {
        res.json({
            error: 'Post title already taken',
        })
        return
    }

    // Make sure category exists
    if (!!req.body.category_id && !(await dbcat.get_category_from_id(dbconn, req.body.category_id))) {
        res.json({
            error: 'Category not found',
        })
        return
    }

    try {
        // Insert the new post
        const sql = 'UPDATE `post` (creator_id, category_id, title, content, updated) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
        let results = await dbconn.query(sql, [
            creator_id,
            req.body.category_id,
            req.body.title,
            req.body.content,
        ])
        res.json({ post_id: results.insertId, })
        return
    } catch (e) {
        console.error('Failed to create post:')
        console.error(e)
    }
    res.json({
        error: 'Failed to create post'
    })
}
