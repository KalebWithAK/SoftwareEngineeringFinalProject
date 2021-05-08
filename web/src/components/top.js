import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './navbar.js'

class Top extends React.Component {
    render() {
        /*if ('session_key' in sessionStorage)
            return (
                <div className='top'>
                    <Navbar />

                    <div className='loginContainer'>
                        <Link to='/login'><button className='loginButton'>Login</button></Link>
                        <Link to='/register'><button className='loginButton'>Register</button></Link>
                    </div>
                </div>
            )

        if (!('session_key' in sessionStorage))
            return (
                <div className='top'>
                    <Navbar />

                    <div className='loginContainer'>
                        <button className='loginButton' onClick={ this.handleLogout }>Logout</button>
                    </div>
                </div>
            )*/
        return (
            <div className='top'>
                <Navbar />
                    <div className='loginContainer'>
                        <Link to='/login'><button className='loginButton'>Login</button></Link>
                        <Link to='/register'><button className='loginButton'>Register</button></Link>
                        <button className='loginButton' onClick={ this.handleLogout }>Logout</button>
                    </div>
            </div>
        )
    }

    handleLogout = () => {
        fetch('http://localhost:3001/api/user/logout', {
            method: 'DELETE',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_key: sessionStorage.getItem('session_key') })
        })
        .then(response => response.json())
        .then(
            (data) => {
                if (data.success === true) {
                    sessionStorage.setItem('session_key', '')
                    alert('You are now logged out')
                    window.location.reload()
                }
            },
            (err) => {
                alert(`We ran into the following error while trying to log you out: ${ err }`)
            }
        )
        
    }
}

export default Top