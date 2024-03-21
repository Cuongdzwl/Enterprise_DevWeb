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
                    <div class="action">
                    <div class="notifactions">
                        <div class="noti">
                            <a href="/">
                                <i class="fa-regular fa-bell"></i>
                            </a>
                        </div>
                        <div class="content">
                            <div class="message">
                                <div class="avatar">

                                </div>
                                <div class="content">
                                    <div class="user">
                                        Nguyen Van A
                                    </div>
                                    <div class="description">
                                        Maintainers before assigning issue to yourself.
                                    </div>
                                </div>
                            </div>
                            <div class="message">
                                <div class="avatar">

                                </div>
                                <div class="content">
                                    <div class="user">
                                        Nguyen Van A
                                    </div>
                                    <div class="description">
                                        Maintainers before assigning issue to yourself.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="profile">
                        <a href="/">
                            <i class="fa-regular fa-user"></i>
                        </a>
                    </div>
                </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;