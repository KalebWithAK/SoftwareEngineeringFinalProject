import React from 'react'

class TemplateEditor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            text: '',
            image: null,
            html: '',
            css: ''
        }
    }
    render() {
        return (
            <div>   
                <h1>Markdown Editor</h1>

                <h3>Title</h3>
                <input onChange={ this.handleTitleChange } />

                <h3>Text</h3>
                <textarea  className='editorTextarea' onChange={ this.handleTextChange } />

                {/*<h3>Image</h3>
                <input type='file' onChange={ this.handleImageUpload } />*/}

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


    submitPost = () => {

        const { title } = this.state

        const html = `
        <div id='post'>
            <h1>${ this.state.title }</h1>
            <p>${ this.state.text }</p>
        </div>
        `

        const css = `
        #post {
            display: flex;
            justify-content: center;
        }
        ` 

        if (sessionStorage.getItem('session_key')) {
            fetch('http://localhost:3001/api/post/create', {
                method: 'PUT',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_key: sessionStorage.getItem('session_key'),
                    category_id: 11,
                    title: title,
                    content: html,
                    //style: css
                })
            })
            .then(response => response.json())
            .then(
                (data) => {
                    console.log(data)
                    //alert('Your post was successfully submitted!')
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

export default TemplateEditor