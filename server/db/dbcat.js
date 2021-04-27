module.exports.get_category_from_id = async (dbconn, category_id) => {
    try {
        let results = await dbconn.query('SELECT category.id, category.title, category.creator_id, user.name FROM (`category` LEFT OUTER JOIN `user` ON category.creator_id=user.id) WHERE category.id=?', [category_id])
        if (results.length > 0) {
            return {
                category_id: results[0].id,
                title: results[0].title,
                creator_id: results[0].creator_id,
                creator_name: results[0].name,
            }
        }
    } catch (e) {
        console.error(`Failed to get category from id ${category_id}:`)
        console.error(e)
    }
    return null
}

module.exports.category_exists = async (dbconn, title) => {
    try {
        let results = await dbconn.query('SELECT COUNT(*) FROM `category` WHERE `title`=?', [title])
        return results.length > 0 && parseInt(results[0]['COUNT(*)']) > 0
    } catch (e) {
        console.error('Failed to check if category exists:')
        console.error(e)
    }
    return false
}
