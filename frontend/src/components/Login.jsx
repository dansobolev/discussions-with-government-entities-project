import React, { Component } from 'react';

class Login extends Component {

    render () {
        const loginFormStyles = {
            marginTop: '5%',
        }

        return (
            <div>
                <div style={loginFormStyles}>
                    <nav className="nav justify-content-center">
                        <h1 className="display-5">Войдите в свой аккаунт</h1>
                    </nav>
                </div>
                <div className="cont" style={loginFormStyles}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <hr className="divider" />
                    <div className="mb-3">
                        <a className="text-decoration-none link-secondary" href="#">New around here? Sign up</a>
                    </div>
                    <div className="mb-3">
                        <a className="text-decoration-none link-secondary" href="#">Forgot password?</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
