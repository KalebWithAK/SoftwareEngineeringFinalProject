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
