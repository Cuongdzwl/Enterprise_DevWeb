import { Link } from 'react-router-dom';
import Logo from '/logo.webp'
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell,
} from "@novu/notification-center";

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);
    const handleMenu = () => {
        setIsActive(!isActive);
    };

    const token = localStorage.getItem('token')
    const decodedToken = token ? jwtDecode(token) : null;
    const userID = decodedToken?.id;

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    const handleOnNotificationClick = (message) => {
        if (message && message.cta && message.cta.data && message.cta.data.url) {
            window.location.href = message.cta.data.url;
        }
    };

    return (
        <nav className="NavBar">
            <div className="logo-2">
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
                        <NovuProvider
                            subscriberId={`${userID}`}
                            applicationIdentifier={"cCNSa5SHFWxD"}>
                            <PopoverNotificationCenter colorScheme="light" onNotificationClick={handleOnNotificationClick} >
                                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
                            </PopoverNotificationCenter>
                        </NovuProvider>
                    </div>
                </div>
                <div className="profile" onClick={handleMenu}>
                    <Link href="#">
                        <i className="fa-regular fa-user"></i>
                    </Link>
                    <div className={`menu ${isActive ? 'active' : ''}`}>
                        <Link to='/profile'>Profile</Link>
                        <Link href="#" onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>

        </nav>
    );
}

export default NavBar;