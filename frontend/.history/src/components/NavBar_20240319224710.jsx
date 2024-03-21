import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div>
            <nav class="NavBar">
                <div class="container">
                    <div class="logo">
                        <div class="logo-img">
                            <img src="../lgo2.webp" width="40px" height="40px" alt="">
                        </div>
                        <div class="logo-text">
                            UNIVERSITY of GREENWICH
                        </div>
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
            </nav>
        </div>
    );
}

export default NavBar;