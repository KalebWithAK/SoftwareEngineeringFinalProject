import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    links = [
        { path: '/', text: 'home', id: 0 },
        { path: '/settings', text: 'settings', id: 1 }
    ]

    render() {
        return (
            <nav className='navbar'>
                { this.links.map(link => 
                    <Link key={link.id} className='navlink' to={ link.path }>{ link.text }</Link>
                )}
            </nav>
        )
    }
}

export default Navbar