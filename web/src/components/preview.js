import React from 'react'
import { Link } from 'react-router-dom'

class Preview extends React.Component {
    render() {
        const { content, title, creator, id } = this.props

        return (
            <Link to={ `/viewpost/${id}` } className='preview'>
                <iframe 
                    className='previewIframe' 
                    src='../iframes/iframe.html' 
                    srcDoc={ `<div>${ content }</div>` } 
                    title={ `${ title } Preview` }>
                </iframe>
                <h3 className='previewTitle'>{ title }</h3>
                <h4 className='previewCreator'>Created by { creator }</h4>
            </Link>
        )
    }
}

export default Preview