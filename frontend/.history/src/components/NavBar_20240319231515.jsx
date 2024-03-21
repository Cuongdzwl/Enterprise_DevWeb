import { Link } from 'react-router-dom';
import Logo from '/logo.webp'

const NavBar = () => {
    return (
        <nav className="NavBar">
            <div className="container">
                <div className="logo">
                    <div className="logo-img">
                        <img src={Logo} width='40px' height='40px' alt="Logo" />
                    </div>
                    <div className="logo-text">
                        UNIVERSITY of GREENWICH
                    </div>
                </div>
                <div className="action">
                    <div className="notifactions">
                        <div className="noti">
                            <a href="/">
                                <i className="fa-regular fa-bell"></i>
                            </a>
                        </div>
                        <div className="content">
                            <div className="message">
                                <div className="avatar">

                                </div>
                                <div className="content">
                                    <div className="user">
                                        Nguyen Van A
                                    </div>
                                    <div className="description">
                                        Maintainers before assigning issue to yourself.
                                    </div>
                                </div>
                            </div>
                            <div className="message">
                                <div className="avatar">

                                </div>
                                <div className="content">
                                    <div className="user">
                                        Nguyen Van A
                                    </div>
                                    <div className="description">
                                        Maintainers before assigning issue to yourself.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile">
                        <a href="/">
                            <i className="fa-regular fa-user"></i>
                        </a>
                        <div className="menu">
                            <a href="">Profile</a>
                            <a href="">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;