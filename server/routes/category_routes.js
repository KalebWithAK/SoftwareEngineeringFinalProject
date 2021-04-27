const dbuser = require('../db/dbuser')
const dbcat = require('../db/dbcat')

module.exports.get_categories = (dbconn) => async (req, res) => {
    try {
        // Default limit to 50 if not provided
        const limit = req.body.limit || 50
        // Start with categories with IDs >=0 by default if not provided
        const start_cat_id = req.body.start_cat_id || 0
        // Yummy SQL :P
        // What this basically does: fetches a list of categories starting at or
        // above category id `start_cat_id` and gets the name of its associated
        // creator via a left join (all categories and only overlapping names)
        // This means if somehow, a creator id doesn't map to a user, the
        // category still appears in this list with a `null` author!
        // DO NULL CHECKS PLEASE!
        const sql = 'SELECT category.id, category.title, user.name FROM (`category` LEFT OUTER JOIN `user` ON category.creator_id=user.id) WHERE category.id>=? LIMIT ?'
        let results = await dbconn.query(sql, [start_cat_id, limit])

        res.json({
            categories: results.map(({id, title, name}) => {
                return {
                    category_id: id,
                    title: title,
                    creator_name: name,
                }
            }),
        })
        return
    } catch (e) {
        console.error('Failed to get category list:')
        console.error(e)
    }
    res.json({
        categories: []
    })
}

module.exports.get_category = (dbconn) => async (req, res) => {
    if (!req.body.category_id) {
        res.json({
            error: 'Missing category id',
        })
    } else {
        res.json((await dbcat.get_category_from_id(dbconn, req.body.category_id)) || {
            error: 'Category not found',
        })
    }
}

module.exports.create_category = (dbconn) => async (req, res) => {
    // Make sure the title was provided
    if (!req.body.title) {
        res.json({
            error: 'Missing category title',
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
    if (await dbcat.category_exists(dbconn, req.body.title)) {
        res.json({
            error: 'Category name already taken',
        })
        return
    }

    try {
        // Insert the new category
        const sql = 'INSERT INTO `category` (creator_id, title) VALUES (?, ?)'
        let results = await dbconn.query(sql, [creator_id, req.body.title])
        res.json({ category_id: results.insertId, })
        return
    } catch (e) {
        console.error('Failed to create category:')
        console.error(e)
    }
    res.json({
        error: 'Failed to create category'
    })
}
