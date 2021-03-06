const dbuser = require('./dbuser')
// Markdown converter
const converter = new (require('showdown')).Converter()
converter.setOption('simplifiedAutoLink', 'true');
converter.setOption('noHeaderId', 'true')
converter.setOption('strikethrough', 'true')
converter.setOption('tables', 'true')
converter.setOption('tasklists', 'true')
converter.setOption('disableForced4SpacesIndentedSublists', 'true')

function parseMarkdown(content) {
    return converter.makeHtml(content)
}

module.exports.query_posts = async (dbconn, where_clauses, where_data) => {
    // Combine SQL WHERE clauses into a single where clause string
    let where = ''
    if (where_clauses.length > 0) {
        where = ' WHERE ' + where_clauses.join(' AND ')
    }

    const sql = `SELECT post.id, post.creator_id, user.name, post.category_id, post.title, post.content, post.created, post.updated FROM (\`post\` LEFT OUTER JOIN \`user\` ON post.creator_id=user.id)${where}`
    let results = await dbconn.query(sql, where_data)
    if (results.length > 0) {
        return results.map(post => {
            return {
                post_id: post.id,
                creator_id: post.creator_id,
                creator_name: post.name,
                category_id: post.category_id,
                title: post.title,
                content: post.content,
                content_html: parseMarkdown(post.content),
                created_timestamp: post.created,
                updated_timestamp: post.updated,
            }
        })
    }
    return []
}

module.exports.get_posts = async (dbconn) => {
    return await module.exports.query_posts(dbconn, [], [])
}

module.exports.get_post_from_id = async (dbconn, post_id) => {
    try {
        const sql = 'SELECT post.id, post.creator_id, user.name, post.category_id, post.title, post.content, post.style, post.created, post.updated FROM (`post` LEFT OUTER JOIN `user` ON post.creator_id=user.id) WHERE post.id=?'
        let results = await dbconn.query(sql, [post_id])
        if (results.length > 0) {
            return {
                post_id: results[0].id,
                creator_id: results[0].creator_id,
                creator_name: results[0].name,
                category_id: results[0].category_id,
                title: results[0].title,
                content: results[0].content,
                content_html: parseMarkdown(results[0].content),
                style: results[0].style,
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

module.exports.get_posts_from_creator = async (dbconn, creator_id) => {
    try {
        const sql = 'SELECT post.id, post.creator_id, user.name, post.category_id, post.title, post.content, post.created, post.updated FROM (`post` LEFT OUTER JOIN `user` ON post.creator_id=user.id) WHERE post.creator_id=?'
        let results = await dbconn.query(sql, [creator_id])
        if (results.length > 0) {
            return results.map(post => {
                return {
                    post_id: post.id,
                    creator_id: post.creator_id,
                    creator_name: post.name,
                    category_id: post.category_id,
                    title: post.title,
                    content: post.content,
                    content_html: parseMarkdown(post.content),
                    created_timestamp: post.created,
                    updated_timestamp: post.updated,
                }
            })
        }
    }
    catch (e) {
        console.error('Failed to get post list')
        console.error(e)
    }
    return []
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

module.exports.has_edit_permission = async (dbconn, creator_id, user_id, session_key) => {
    // Admins can update anyone's post
    if (await dbuser.is_admin(dbconn, session_key)) return true

    // Other users can only edit their own posts
    return user_id == creator_id
}
