import React from 'react'
import Preview from '../components/preview.js'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [
                { creator: 'Kaleb', title: 'hi there', html: '<h1>Example Preview</h1><p>This is an example of an html file to be rendered in a post preview component.I want to use an iframe inside of the post preview component but since an html src is required, I\'m creating this file. That should be enough text. But just in case, boogilaboo.</p>', css: 'h1 { background: red }' }
            ]
        }
    }

    componentDidMount() {
        // TODO - fetch creator, title, html, and css for each post from /getPosts
    }

    render() {
        const { posts } = this.state
        return (
            <div>
                <div className='previewLayout'>
                    { posts.map(post => <Preview html={ post.html } css={ post.css } title={ post.title }  creator={ post.creator } />) }
                </div>
            </div>
        )
    }
}

export default Home