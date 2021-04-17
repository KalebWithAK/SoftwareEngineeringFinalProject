import React from 'react'
import Parser from 'html-react-parser'

class Post extends React.Component {
    render() {
        const { html, css } = this.props

        // parser renders the html and css for the selected page
        // not sure if we'll still include the title and author on this page or just render the html
        return (
            <div>
                { Parser(`${ html }  <style>${ css }<style>`) }
            </div>
        )
    }
}

export default Post