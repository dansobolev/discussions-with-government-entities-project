import React from 'react';
import anonymous_image from '../images/anonymous.jpg';


// Stateless Functional Component
const NavBar = (props) => {
    const userLogin = props.currentUser;
    const profileImage = props.currenUserImage;

    return (
        <div>
            <div className="row g-2 bg-light">
                <div className="mb-2 col-md-11" style={{paddingLeft: '20px'}}>
                    <a className="nav-link active" href="/"><h2>Переписошная</h2></a>
                </div>
                <div className="mb-2 col-md-1 text-center">
                    {userLogin != null ?
                        (
                            <div>
                                <div>
                                    {profileImage == null ?
                                        (
                                            <img src={anonymous_image} width="45" height="45" alt=""/>
                                        ) :
                                        (
                                            // TODO: user profile image
                                            <div></div>
                                        )
                                    }
                                </div>
                                <div>
                                    {userLogin}
                                </div>
                            </div>
                        ) : (
                        <div>
                            <div>
                                <img src={anonymous_image} width="45" height="45" alt=""/>
                            </div>
                            <div>
                                Аноним
                            </div>
                        </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
