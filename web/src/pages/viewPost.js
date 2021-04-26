import React from 'react'
import Post from '../components/post.js'

class ViewPost extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            html: '',
            css: ''
        }
    }

    componentDidMount() {
        const postId = this.props

        // TODO - fetch html and css from /getPost/${ postId }
    }

    render() {
        const { html, css } = this.state

        return (
            <div className='displayPreview'>
                <Post html={ html } css={ css } />
            </div>
        )
    }
}

export default ViewPost