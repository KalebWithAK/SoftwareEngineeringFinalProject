import React from 'react'
import { Link } from 'react-router-dom'

class CreatorManagement extends React.Component {
    render() {
        return (
            <div>
                <button><Link to='/templateEditor'>Create Template Post</Link></button>
                <button><Link to='/customEditor'>Create Custom Post</Link></button>
            </div>
        )
    }
}

export default CreatorManagement