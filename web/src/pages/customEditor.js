import React from 'react'

class CustomEditor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            html: '',
            css: '',
            err: null
        }
    }

    render() {
        return (
            <div>
                <h1>Custom Editor</h1>

                <h3>Title</h3>
                <input onChange={ this.handleTitleChange } />

                <h3>HTML</h3>
                <textarea className='editorTextarea' onChange={ this.handleHtmlChange } />

                <h3>CSS</h3>
                <textarea className='editorTextarea' onChange={ this.handleCssChange } />

                <div />
                <button className='submitButton' onClick={ this.submitPost }>Submit Post</button> 
            </div>
        )
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    handleHtmlChange = (e) => {
        this.setState({ html: e.target.value })
    }

    handleCssChange = (e) => {
        this.setState({ css: e.target.value })
    }

    submitPost = () => {
        const { title, html, css } = this.state

        if (sessionStorage.getItem('session_key')) {
            fetch('http://localhost:3001/api/post/create', {
                method: 'PUT',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_key: sessionStorage.getItem('session_key'),
                    category_id: 99999999,
                    title,
                    content: html,
                    style: css
                })
            })
            .then(response => response.json())
            .then(
                (data) => {
                    alert('Your post was successfully submitted!')
                },
                (err) => {
                    this.setState({
                        err
                    })
                }
            )
        } else {
            this.props.history.push('/login')
        }
    }
}

export default CustomEditor