import React from 'react'
import Preview from '../components/preview.js'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            loading: true,
            err: null
        }
    }

    componentDidMount() {
        // TODO - fetch creator, title, and content for each post from /getPosts
        fetch('http://localhost:3001/api/post/list')
        .then(response => response.json())
        .then(
            (data) => {
                this.setState({
                    posts: data.posts,
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
        const { posts, loading, err } = this.state
        
        return (
            (loading) ? <div>loading...</div> : 
            (err) ? <div>We ran into an error while loading posts: { err.message }</div> :
            <div className='previewLayout'>
                { posts.map(post => <Preview key={ post.post_id } title={ post.title }  creator={ post.creator_name } content={ post.content } id={ post.post_id }/>) }
            </div>
        )
    }
}

export default Home