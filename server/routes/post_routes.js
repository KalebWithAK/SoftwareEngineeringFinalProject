const dbuser = require('../db/dbuser')
const dbpost = require('../db/dbpost')
const dbcat = require('../db/dbcat')

module.exports.get_posts = (dbconn) => async (req, res) => {
    res.json({
        posts: await dbpost.get_posts(dbconn),
    })
}

module.exports.get_post = (dbconn) => async (req, res) => {
    if (!req.body.post_id) {
        res.json({
            error: 'Missing post id',
        })
    } else {
        res.json((await dbpost.get_post_from_id(dbconn, req.body.post_id)) || {
            error: 'Post not found',
        })
    }
}

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
    let post = await dbpost.get_post_from_id(dbconn, req.body.post_id)
    if (!post) {
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
    let user_id = await dbuser.session_user_id(dbconn, req.body.session_key)
    if (user_id < 0) {
        res.json({
            error: 'Failed to check creator id',
        })
        return
    }

    // Check if the user has permission to edit this post
    if (!(await dbpost.has_edit_permission(dbconn, post.creator_id, user_id, req.body.session_key))) {
        res.json({
            error: 'Insufficient permissions to edit the specified post',
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

    // Add to query as needed
    let editSql = ""
    let vars = []
    if (!!req.body.category_id) {
        editSql += "category_id=?,"
        vars.push(req.body.category_id)
    }
    if (!!req.body.title) {
        editSql += "title=?,"
        vars.push(req.body.title)
    }
    if (!!req.body.content) {
        editSql += "content=?,"
        vars.push(req.body.content)
    }
    vars.push(req.body.post_id)

    try {
        // Update the post
        const sql = `UPDATE \`post\` SET ${editSql}updated=CURRENT_TIMESTAMP WHERE \`id\`=?`
        let results = await dbconn.query(sql, vars)
        res.json({ success: true, })
        return
    } catch (e) {
        console.error('Failed to update post:')
        console.error(e)
    }
    res.json({
        error: 'Failed to update post'
    })
}

module.exports.delete_post = (dbconn) => async (req, res) => {
    // Make sure post_id is provided
    if (!req.body.post_id) {
        res.json({
            error: 'Missing post id',
        })
        return
    }

    // Make sure post_id is valid
    let post = await dbpost.get_post_from_id(dbconn, req.body.post_id)
    if (!post) {
        res.json({
            error: 'Post not found',
        })
        return
    }

    // Get the ID of the creator
    let user_id = await dbuser.session_user_id(dbconn, req.body.session_key)
    if (user_id < 0) {
        res.json({
            error: 'Failed to check creator id',
        })
        return
    }

    // Check if the user has permission to delete this post
    if (!(await dbpost.has_edit_permission(dbconn, post.creator_id, user_id, req.body.session_key))) {
        res.json({
            error: 'Insufficient permissions to delete the specified post',
        })
        return
    }

    try {
        // Delete the post
        const sql = 'DELETE FROM `post` WHERE `id`=?'
        let results = await dbconn.query(sql, [req.body.post_id])
        res.json({ success: true, })
        return
    } catch (e) {
        console.error('Failed to delete post:')
        console.error(e)
    }
    res.json({
        error: 'Failed to delete post'
    })
}
