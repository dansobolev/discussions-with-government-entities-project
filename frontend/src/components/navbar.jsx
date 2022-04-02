import React from 'react';


// Stateless Functional Component
const NavBar = () => {
    return (
        <div>
            <nav className="nav justify-content-center bg-light m-2 p-2 ">
                <a className="nav-link active" href="#"><h2>Переписошная</h2></a>
            </nav>
        </div>
    );
};

export default NavBar;
