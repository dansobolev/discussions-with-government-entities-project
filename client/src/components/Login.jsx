import React, { useState } from 'react';
import axios from "axios";


const Login = () => {
    const [login, setLogin] = useState({login: ""})
    const [password, setPassword] = useState({password: ""})

    function logInUser(event) {
        axios({
            method: "POST",
            url: "//localhost:8080/login",
            data: {login, password},
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    window.location.href = '/';
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        event.preventDefault()
    }

    const loginFormStyles = {
        marginTop: '5%',
    };

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
                        <label htmlFor="exampleInputEmail1" className="form-label">Электронная почта или номер телефона</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <div id="emailHelp" className="form-text">Мы не передаем ваши данные третьим лицам.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={logInUser}
                    >
                        Submit
                    </button>
                </form>
                <hr className="divider" />
                <div className="mb-3">
                    <a className="text-decoration-none link-secondary" href="/register">Все еще не с нами? Зарегистрируйтесь!</a>
                </div>
                <div className="mb-3">
                    <a className="text-decoration-none link-secondary" href="/forgot-password">Забыли пароль?</a>
                </div>
            </div>
        </div>
    )
}

export default Login;
