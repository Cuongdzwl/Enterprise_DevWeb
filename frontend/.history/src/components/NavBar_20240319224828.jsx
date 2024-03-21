import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className='NavBar'>
            <div className="container">
            <div className="logo">
                    <div class="logo-img">
                        <img src="../lgo2.webp" width="40px" height="40px" alt="">
                    </div>
                    <div class="logo-text">
                        UNIVERSITY of GREENWICH
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;