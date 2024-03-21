import { Link } from 'react-router-dom';
import Logo from '/logo.webp'

const NavBar = () => {
    return (
        <nav className='NavBar'>
            <div className="container">
                <div className="logo">
                    <div className="logo-img">
                        <img src={Logo} className="logo" alt="Vite logo" width="40px" height="40px" />
                    </div>
                    <div className="logo-text">
                        UNIVERSITY of GREENWICH
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;