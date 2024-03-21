import { Link } from 'react-router-dom';
import Logo from '/web'

const NavBar = () => {
    return (
        <nav className='NavBar'>
            <div className="container">
                <div className="logo">
                    <div className="logo-img">
                        <img src={logo} alt="" />
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