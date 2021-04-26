module.exports.get_post_from_id = async (dbconn, post_id) => {
    try {
        const sql = 'SELECT post.id, user.name, post.category_id, post.title, post.content, post.created, post.updated FROM (`post` LEFT OUTER JOIN `user` ON post.creator_id=user.id) WHERE `post_id`=?'
        let results = await dbconn.query(sql, [post_id])
        if (results.length > 0) {
            return {
                post_id: results[0].id,
                creator_name: results[0].name,
                category_id: results[0].category_id,
                title: results[0].title,
                content: results[0].content,
                created_timestamp: results[0].created,
                updated_timestamp: results[0].updated,
            }
        }
    } catch (e) {
        console.error(`Failed to get post from id ${post_id}:`)
        console.error(e)
    }
    return null
}

module.exports.post_exists = async (dbconn, title) => {
    try {
        let results = await dbconn.query('SELECT COUNT(*) FROM `post` WHERE `title`=?', [title])
        return results.length > 0 && parseInt(results[0]['COUNT(*)']) > 0
    } catch (e) {
        console.error('Failed to check if post exists:')
        console.error(e)
    }
    return false
}
