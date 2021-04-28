import React from 'react'
//import Parser from 'html-react-parser'

class Post extends React.Component {
    render() {
        const { title, creator, content } = this.props

        // parser renders the html and css for the selected page
        // not sure if we'll still include the title and author on this page or just render the html
        return (
            <div>
                <h1>{ title }</h1>
                { (creator.trim() !== '') ? <p>Created By: { creator }</p> : null }
                { content }
            </div>
        )
    }
}

export default Post