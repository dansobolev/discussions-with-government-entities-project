import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Registration from "./components/Registration";
import { DiscussionsList } from "./components/discussionsList";
import Discussion from "./components/Discussion";
import UserProfile from "./components/UserProfile";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<DiscussionsList />} />
                <Route path="/discussions/:discussionId" exact element={<Discussion />} />
                <Route path="/profiles/:userId" exact element={<UserProfile />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/register" exact element={<Registration />} />
                <Route path="/logout" exact />
                <Route path="/forgot-password" exact />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
