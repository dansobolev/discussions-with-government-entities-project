import React from 'react';
import anonymous_image from '../images/anonymous.jpg';
import doc_logo from "../images/document_icon.svg";


// Stateless Functional Component
const NavBar = (props) => {
    const user = props.currentUser
    console.log(user);
    console.log('NavBar component');
    return (
        <div>
            <div className="row g-2 bg-light">
                <div className="mb-2 col-md-11" style={{paddingLeft: '20px'}}>
                    <a className="nav-link active" href="/"><h2>Переписошная</h2></a>
                </div>
                {/*<div className="mb-2 col-md-1 text-center">*/}
                {/*    {user.login != null ?*/}
                {/*        (*/}
                {/*            <div>123</div>*/}
                {/*        ) : (*/}
                {/*        // <div>*/}
                {/*        //     <img src={anonymous_image} width="45" height="45" alt=""/>*/}
                {/*        // </div>*/}
                {/*        <div>*/}
                {/*            Аноним*/}
                {/*        </div>*/}
                {/*        )}*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default NavBar;
