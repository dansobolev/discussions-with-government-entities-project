import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

import NavBar from './navbar';
import DiscussionName from "./discussionName";
import DiscussionMessage from './discussionMessage';
import DiscussionInvitation from './discussionInvitation';

const Discussion = () => {
    const [userId, setUserId] = useState(null);
    const [userLogin, setUserLogin] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [discussionData, setDiscussionData] = useState({});
    const [commentMessage, setCommentMessage] = useState(null);
    const [newParticipantLogin, setNewParticipantLogin] = useState(null);
    const urlParams = useParams();
    const discussionId = urlParams.discussionId

    const createComment = () => {
        axios({
            method: "POST",
            url: `//localhost:8080/${discussionId}/comments`,
            data: JSON.stringify({
                author_id: userId,
                comment_text: commentMessage}),
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    console.log(resp.data)
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

    const addParticipant = () => {
        axios({
            method: "POST",
            url: `//localhost:8080/${discussionId}/participant`,
            data: JSON.stringify({
                login: newParticipantLogin
            }),
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    console.log(resp.data)
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

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
                data: JSON.stringify({discussion_id_: urlParams.discussionId}),
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
            <div className="cont">
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Добавить участника"
                           aria-label="Добавить участника" aria-describedby="basic-addon2"
                           onChange={(e) => setNewParticipantLogin(e.target.value)}
                    />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => addParticipant()}
                            >
                                Button
                            </button>
                        </div>
                </div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Добавить комментарий"
                           aria-label="Добавить комментарий" aria-describedby="basic-addon2"
                           onChange={(e) => setCommentMessage(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => createComment()}
                        >
                            Button
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )

}

export default Discussion;
