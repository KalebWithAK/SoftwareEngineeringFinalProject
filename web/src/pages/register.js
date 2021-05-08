import React from 'react'

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            name: '',
            err: null,
            success: false
        }
    }

    render() {
        return (
            <div>
                <p>Email</p>
                <input className='loginInput' onChange={ this.handleEmailChange } />

                <p>Password</p>
                <input className='loginInput' type='password' onChange={ this.handlePasswordChange } />

                <p>Name</p>
                <input type='name' onChange={ this.handleNameChange } onSubmit={ this.handleSubmit } />

                <div />
                <button onClick={ this.handleSubmit }>Register</button>
            </div>
        )
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    handleNameChange = (e) => {
        this.setState({ name: e.target.value })
    }

    handleSubmit = () => {
        const { email, password, name } = this.state
        
        if (email.trim() !== '' && password.trim() !== '' && name.trim() !== '') {
            this.register(email, password, name)
        }

        if (this.state.success) {
            this.login(email, password)
        }
    }

    register = (email, password, name) => {
        fetch('http://localhost:3001/api/user/register', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
        .then(response => response.json())
        .then(
            (data) => {
                this.setState({ success: data.success })
            },
            (err) => {
                this.setState({
                    err
                })
            }
        )
    }

    login = (email, password) => {
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

export default Register