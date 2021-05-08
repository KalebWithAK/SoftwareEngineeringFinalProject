import React from 'react'

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            err: null
        }
    }
    render() {
        return (
            <div>
                <p>Email</p>
                <input onChange={ this.handleEmailChange } />

                <p>Password</p>
                <input type='password' onChange={ this.handlePasswordChange } />

                <div />
                <button onClick={ this.handleSubmit }>Login</button>
            </div>
        )
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    handleSubmit = () => {
        const { email, password } = this.state
        
        fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(
            (data) => {
                sessionStorage.setItem('session_key', data.session_key.session)
                this.props.history.push('/')
                window.location.reload()
            },
            (err) => {
                this.setState({
                    err
                })
            }
        )
    }
}

export default Login