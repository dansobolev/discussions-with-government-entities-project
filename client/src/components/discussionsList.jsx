import React, {useState, useEffect} from 'react';
import NavBar from './navbar';
import axios from "axios";


const DiscussionList = (props) => {
    const item = props.item

    const discussionListStyles = {
        marginBottom: '5%',
    }

    const discussionUrl = `/discussions/${item.id}`

    return (
        <div className="col-sm-6" style={discussionListStyles}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><a className="link-dark" href={discussionUrl}>{item.name}</a></h5>
                    <p className="card-text">Дата создания: {item.created_at}</p>
                    <p>Количество участников: TBD</p>
                </div>
            </div>
        </div>
    )
}


const DiscussionsList = () => {
    const [userId, setUserId] = useState(null);
    const [userLogin, setUserLogin] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [items, setItems] = useState([]);

    function getDiscussionsList () {
        axios({
            method: "GET",
            url: "//localhost:8080/discussions/list",
            withCredentials: true,
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setItems(resp.data.items);
                }
            }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
        })
    }

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

    useEffect(() => {
        (() => {
            getCurrentUser();
            getDiscussionsList();
        })();
    }, []);

    const all_items = [];
    for (const [index, value] of items.entries()) {
        all_items.push(<DiscussionList key={value.id} item={value} />)
    }

    const containersStyles = {
        marginTop: '2%',
        marginLeft: '20%',
        marginRight: '20%'
    }

    return (
        <React.Fragment>
            <NavBar
                currentUser={userLogin}
                currentUserId={userId}
                currenUserImage={userImage}
            />
            <div className="row cont" style={containersStyles}>
                {all_items}
            </div>

        </React.Fragment>
    )
}

export { DiscussionsList, DiscussionList };
