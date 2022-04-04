import React, { useState, useEffect } from 'react';
import NavBar from './components/navbar';
import DiscussionName from "./components/discussionName";
import DiscussionMessage from './components/discussionMessage';
import DiscussionInvitation from './components/discussionInvitation';
import axios from "axios";

const App = () => {
    const [userLogin, setUserLogin] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const discussionName = 'Тестовая переписка';

    function getAllDiscussions () {
        axios({
            method: "GET",
            url: "//localhost:8080/discussions/list",
            withCredentials: true,
        }).then((resp) => {
            if (resp.status === 200) {
                console.log(resp.data)
            }
        })
    }

    // TODO: send request before render!
    useEffect(() => {
        (() => {
            axios({
                method: "POST",
                url: "//localhost:8080/current-user",
                data: {},
                withCredentials: true,
            })
                .then((resp) => {
                    if (resp.status === 200) {
                        setUserLogin(resp.data.login);
                        setUserImage(resp.data.profile_image);
                    }
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response)
                    }
                })
            getAllDiscussions();
        })();
    }, []);

    return (
        <React.Fragment>
            <NavBar currentUser={userLogin} currenUserImage={userImage} />
            <DiscussionName discussionName={discussionName} />
            <DiscussionMessage />
            <DiscussionInvitation />
            <DiscussionMessage />
            <DiscussionMessage />
        </React.Fragment>
    )

}

export default App;
