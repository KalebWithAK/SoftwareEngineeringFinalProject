import React from 'react'

class CustomEditor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            html: '',
            css: '',
        }
    }

    render() {
        return (
            <div>
                <h1>Custom Editor</h1>

                <h3>HTML</h3>
                <textarea className='editorTextarea' onChange={ this.handleHtmlChange } />

                <h3>CSS</h3>
                <textarea className='editorTextarea' onChange={ this.handleCssChange } />

                <div />
                <button className='submitButton' onClick={ this.submitPost }>Submit Post</button> 
            </div>
        )
    }

    handleHtmlChange = (e) => {
        this.setState({ html: e.target.value })
    }

    handleCssChange = (e) => {
        this.setState({ css: e.target.value })
    }

    submitPost = () => {
        console.log(`html: ${ this.state.html }, css: ${ this.state.css }`)
        // TODO - send request to /createPost with html and css
    }
}

export default CustomEditor