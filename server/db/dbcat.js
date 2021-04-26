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
