import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const SideBar = () => {
    return (
        <aside className="SideBar">
            <Route
            <ul className="list-menu">
                <li className="list-item active">
                    <a href="">
                        <i className="fa-solid fa-house"></i>
                        Home page
                    </a>
                </li>
                <li className="list-item ">
                    <a href="">
                        <i className="fa-solid fa-table-columns"></i>
                        Dashboard
                    </a>
                </li>
                <li className="list-item ">
                    <a href="">
                        <i className="fa-solid fa-user"></i>
                        Account
                    </a>
                </li>
                <li className="list-item ">
                    <a href="">
                        <i className="fa-solid fa-graduation-cap"></i>
                        Faculity
                    </a>
                </li>
                <li className="list-item ">
                    <a href="">
                        <i className="fa-regular fa-calendar"></i>
                        Event
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;