import React, { Component } from "react";

class Registration extends Component {
    render () {
        const registrationFormStyles = {
            marginTop: '3%',
        }

        return (
            <div>
                <div style={registrationFormStyles}>
                    <nav className="nav justify-content-center">
                        <h1 className="display-5">Зарегистрируйтесь!</h1>
                    </nav>
                </div>
                <div className="cont" style={registrationFormStyles}>
                    <form className="row g-2">
                        <div className="mb-2 col-md-6">
                            <label htmlFor="firstname" className="form-label">Имя</label>
                            <input type="text" className="form-control" id="firstname" required/>
                        </div>
                        <div className="mb-2 col-md-6">
                            <label htmlFor="username" className="form-label">Логин</label>
                            <input type="text" className="form-control" id="username" />
                        </div>
                        <div className="mb-2 col-md-6">
                            <label htmlFor="lastname" className="form-label">Фамилия</label>
                            <input type="text" className="form-control" id="lastname" />
                        </div>
                        <div className="mb-2 col-md-6">
                            <label htmlFor="emailAddress" className="form-label">Почта</label>
                            <input type="email" className="form-control" id="emailAddress" />
                        </div>
                        <div className="mb-2 col-md-6">
                            <label htmlFor="secondname" className="form-label">Отчество</label>
                            <input type="text" className="form-control" id="secondname" />
                        </div>
                        <div className="mb-2 col-md-6">
                            <label htmlFor="phone" className="form-label">Номер телефона</label>
                            <input type="text" className="form-control" id="phone" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="formFile" className="form-label">Добавить аватарку</label>
                            <input className="form-control" type="file" id="formFile" />
                        </div>
                        <hr className="divider" />
                        <div className="mb-2">
                            <label htmlFor="exampleInputPassword1" className="form-label">Введите пароль</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="exampleInputPassword1" className="form-label">Повторите пароль</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Registration;
