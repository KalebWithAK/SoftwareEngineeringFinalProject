import React from 'react'
import { Link } from 'react-router-dom'

class Preview extends React.Component {
    render() {
        const { html, css, title, creator } = this.props

        return (
            <Link to='/viewpost' className='preview'>
                <iframe 
                    className='previewIframe' 
                    src='../iframes/iframe.html' 
                    srcDoc={ `<div>${ html }</div> <style>${ css }</style>` } 
                    title={ `${ title } Preview` }>
                </iframe>
                <h3 className='previewTitle'>{ title }</h3>
                <h4 className='previewCreator'>Created by { creator }</h4>
            </Link>
        )
    }
}

export default Preview