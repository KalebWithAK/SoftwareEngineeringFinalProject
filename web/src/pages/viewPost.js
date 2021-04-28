import React from 'react'
import Post from '../components/post.js'

class ViewPost extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            creator: '',
            content: '',
            loading: true,
            err: null
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params

        // TODO - fetch html and css from /post/${ id }
        fetch(`http://localhost:3001/api/post/get/${ id }`, {
            method: 'get',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ post_id: id })
        })
        .then(response => response.json())
        .then(
            (data) => {
                this.setState({
                    creator: data.creator_name,
                    content: data.content,
                    title: data.title,
                    loading: false
                })
            },
            (err) => {
                this.setState({
                    loading: false,
                    err
                })
            }
        )

    }

    render() {
        const { content, title, creator, loading, err } = this.state

        return (
            (loading) ? <div>loading...</div> : 
            (err) ? <div>We ran into an error while loading the selected post: { err.message }</div> : 
            <div className='displayPreview'>
                <Post title={ title } creator={ creator } content={ content } />
            </div>
        )
    }
}

export default ViewPost