import React, { useState, useEffect } from 'react';
import NavBar from './components/navbar';
import DiscussionName from "./components/discussionName";
import DiscussionMessage from './components/discussionMessage';
import DiscussionInvitation from './components/discussionInvitation';
import axios from "axios";

const App = () => {
    const [user, setUser] = useState({"login": ""})
    const discussionName = 'Тестовая переписка';

    // useEffect(() => {
    //     (() => {
    //         try {
    //             const resp = httpClient.post(
    //                 'http://127.0.0.1:8080/current-user', {}
    //             );
    //             setUser(resp.data.login);
    //         } catch (error) {
    //             console.log('Not authenticated');
    //         }
    //     })();
    // }, []);
    useEffect(() => {
        (() => {
            axios({
                method: "POST",
                url: "http://127.0.0.1:8080/current-user",
                data: {}
            })
                .then((resp) => {
                    if (resp.status === 200) {
                        setUser(resp.data.login);
                    }
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response)
                    }
                })
        })();
    }, []);
    // const getCurrentUser = () => {
    //     axios({
    //         method: "POST",
    //         url: "http://127.0.0.1:8080/current-user",
    //         data: {}
    //     })
    //         .then((resp) => {
    //             if (resp.status === 200) {
    //                 console.log(resp.data)
    //                 setUser(resp.data.login);
    //             }
    //         }).catch((error) => {
    //         if (error.response) {
    //             console.log(error.response)
    //         }
    //     })
    // }
    // getCurrentUser()

    // TODO: show current user information somewhere
    // TODO: https://www.youtube.com/watch?v=sBw0O5YTT4Q  timing: 48:06
    return (
        <React.Fragment>
            <NavBar currentUser={user} />
            <DiscussionName discussionName={discussionName} />
            <DiscussionMessage />
            <DiscussionInvitation />
            <DiscussionMessage />
            <DiscussionMessage />
        </React.Fragment>
    )

}

export default App;
