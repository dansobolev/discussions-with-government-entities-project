import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

import NavBar from './navbar';
import DiscussionName from "./discussionName";
import DiscussionMessage from './discussionMessage';
import DiscussionInvitation from './discussionInvitation';

const Discussion = () => {
    const [userLogin, setUserLogin] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [discussionData, setDiscussionData] = useState({});
    const urlParams = useParams();

    function getDiscussion (discussionId) {
        axios({
            method: "GET",
            url: `//localhost:8080/discussions/${discussionId}`,
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setDiscussionData(resp.data.items[0]);
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

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
            getDiscussion(urlParams.discussionId);
        })();
    }, []);

    const all_items = [];
    if (discussionData.discussion_entities !== undefined) {
        for (const [index, value] of discussionData.discussion_entities.entries()) {
            if ('inviter' in value) {
                all_items.push(<DiscussionInvitation data={value} />)
            } else {
                all_items.push(<DiscussionMessage data={value} />)
            }
        }
    }

    return (
        <React.Fragment>
            <NavBar currentUser={userLogin} currenUserImage={userImage} />
            <DiscussionName discussionName={discussionData.name} />
            {all_items}
        </React.Fragment>
    )

}

export default Discussion;
