const SideBar = () => {
    return (
        <aside class="SideBar">
            <ul class="list-menu">
                <li class="list-item active">
                    <a href="">
                        <i class="fa-solid fa-house"></i>
                        Home page
                    </a>
                </li>
                <li class="list-item ">
                    <a href="">
                        <i class="fa-solid fa-table-columns"></i>
                        Dashboard
                    </a>
                </li>
                <li class="list-item ">
                    <a href="">
                        <i class="fa-solid fa-user"></i>
                        Account
                    </a>
                </li>
                <li class="list-item ">
                    <a href="">
                        <i class="fa-solid fa-graduation-cap"></i>
                        Faculity
                    </a>
                </li>
                <li class="list-item ">
                    <a href="">
                        <i class="fa-regular fa-calendar"></i>
                        Event
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;