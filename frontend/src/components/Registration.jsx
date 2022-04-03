import React, { useState } from "react";
import httpClient from "../httpClient";

const Registration = () => {
    const [registrationForm, setRegistrationForm] = useState({
        firstname: "",
        lastname: "",
        middlename: "",
        login: "",
        phone_number: "",
        password: ""
    });

    const registerNewUser = async () => {
        console.log('sending data');
        const resp = await httpClient.post(
            "http://127.0.0.1:8080/register",
            {
                firstname: registrationForm.firstname,
                lastname: registrationForm.lastname,
                middlename: registrationForm.middlename,
                login: registrationForm.login,
                phone_number: registrationForm.phone_number,
                password: registrationForm.password,
            }
        );
        console.log(resp.data);
        console.log(resp.status);
    }

    const registrationFormStyles = {
        marginTop: '3%',
    };

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
                        <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            required
                        />
                    </div>
                    <div className="mb-2 col-md-6">
                        <label htmlFor="login" className="form-label">Логин</label>
                        <input type="text" className="form-control" id="login" />
                    </div>
                    <div className="mb-2 col-md-6">
                        <label htmlFor="lastname" className="form-label">Фамилия</label>
                        <input type="text" className="form-control" id="lastname" />
                    </div>
                    <div className="mb-2 col-md-6">
                        <label htmlFor="email" className="form-label">Почта</label>
                        <input type="email" className="form-control" id="email" />
                    </div>
                    <div className="mb-2 col-md-6">
                        <label htmlFor="middlename" className="form-label">Отчество</label>
                        <input type="text" className="form-control" id="middlename" />
                    </div>
                    <div className="mb-2 col-md-6">
                        <label htmlFor="phone_number" className="form-label">Номер телефона</label>
                        <input type="text" className="form-control" id="phone_number" />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="formFile" className="form-label">Добавить аватарку</label>
                        <input className="form-control" type="file" id="formFile" />
                    </div>
                    <hr className="divider" />
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Пароль</label>
                        <input type="password" className="form-control" id="password" />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => registerNewUser()}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Registration;
