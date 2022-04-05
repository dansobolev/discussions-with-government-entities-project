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

    useEffect(() => {
        (() => {
            getDiscussionsList();
        })();
    }, []);

    const all_items = [];
    for (const [index, value] of items.entries()) {
        all_items.push(<DiscussionList item={value} />)
    }

    return (
        <React.Fragment>
            <NavBar />
            <div className="row mt-4 mb-4 cont p-3">
                {all_items}
            </div>

        </React.Fragment>
    )
}

export default DiscussionsList;
