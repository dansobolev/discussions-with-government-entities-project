import React from 'react';


const DiscussionName = ({ discussionName }) => {
    return (
        <div>
            <nav className="nav justify-content-center m-2 p-2">
                <h1 className="display-5">{discussionName}</h1>
            </nav>
        </div>
    );
};

export default DiscussionName;
