import React from 'react'
import Post from '../components/post.js'

class ViewPost extends React.Component {
    render() {
        const { html, css } = this.props

        return (
            <div className='displayPreview'>
                <Post html={ html } css={ css } />
            </div>
        )
    }
}

export default ViewPost