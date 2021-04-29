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
                <form onSubmit={ this.handleSubmit }>
                    <p>Email</p>
                    <input onChange={ this.handleEmailChange } />

                    <p>Password</p>
                    <input type='password' onChange={ this.handlePasswordChange } />

                    <div />
                    <input type='submit' />
                </form>
            </div>
        )
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log('handleSubmit')

        const { email, password } = this.state
        console.log(`email: ${ email } password: ${ password }`)

        fetch('http://localhost:3001/api/user/login', {
            method: 'POST',
            mode: 'cors',
            headers: 'Content-Type: application/json',
            body: JSON.stringify({ 
                email: this.state.email, 
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(
            (data) => {
                console.log(data.session_key.session)
                //sessionStorage.setItem("session_key", data.session_key.session)
            },
            (err) => {
                this.setState({ err })
            }
        )
    }
}

export default Login