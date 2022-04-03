import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from "./components/Login";
import Registration from "./components/Registration";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/register" exact element={<Registration />} />
                <Route path="/logout" exact />
                <Route path="/forgot-password" exact />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
