import React, { useState, useEffect } from 'react';
import axios from "axios";
import NavBar from "./navbar";
import { DiscussionList } from "./discussionsList";
import {useParams} from "react-router-dom";


const UserProfile = () => {
    const [userId, setUserId] = useState(null);
    const [userLogin, setUserLogin] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userDiscussions, setUserDiscussions] = useState([]);
    const urlParams = useParams();

    const getCurrentUser = () => {
        axios({
            method: "POST",
            url: "//localhost:8080/current-user",
            data: JSON.stringify({}),
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setUserId(resp.data.user_id);
                    setUserLogin(resp.data.login);
                    setUserImage(resp.data.profile_image);
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

    const getCurrentUserDiscussion = userId => {
        axios({
            method: "GET",
            url: `//localhost:8080/${userId}/discussions/list`,
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setUserDiscussions(resp.data.items);
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

    useEffect(() => {
        (() => {
            getCurrentUser();
            getCurrentUserDiscussion(urlParams.userId);
        })();
    }, []);

    const all_items = [];
    for (const [index, value] of userDiscussions.entries()) {
        all_items.push(<DiscussionList key={value.id} item={value} />)
    }

    return (
        <React.Fragment>
            <NavBar
                currentUser={userLogin}
                currentUserId={userId}
                currenUserImage={userImage}
            />
            <div>
                <nav className="nav justify-content-center m-2 p-2">
                    <h1 className="display-5">Ваши переписки:</h1>
                </nav>
            </div>
            <div className="row mt-4 mb-4 cont p-3">
                {all_items}
            </div>

        </React.Fragment>
    )
}

export default UserProfile;
