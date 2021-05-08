import React from 'react'

class TemplateEditor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            text: '',
            image: '',
            html: '',
            css: ''
        }
    }
    render() {
        return (
            <div>   
                <h1>Template Editor</h1>

                <h3>Title</h3>
                <input onChange={ this.handleTitleChange } />

                <h3>Text</h3>
                <textarea  className='editorTextarea' onChange={ this.handleTextChange } />

                <h3>Image</h3>
                <input type='file' onChange={ this.handleImageUpload } />

                <div />
                <button className='submitButton' onClick={ this.submitPost }>Submit Post</button>
            </div>
        )
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    handleTextChange = (e) => {
        this.setState({ text: e.target.value })
    }

    handleImageUpload = (e) => {
        this.setState({ image: e.target.value })
    }

    createPost = () => {
        const html = `
        <div id='post'>
            <h1>${ this.state.title }</h1>
            <p>${ this.state.text }</p>
            <img src=${ this.state.image }>
        </div>
        `
        const css = `
        #post {
            display: flex;
            justify-content: center;
        }
        `

        this.setState({ html, css })
    }

    submitPost = () => {
        console.log(`html: ${ this.state.html }, css: ${ this.state.css }`)
        // TODO - send request to /createPost with html and css
    }
}

export default TemplateEditor