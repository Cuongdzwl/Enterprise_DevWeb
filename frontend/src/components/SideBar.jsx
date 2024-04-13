import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UserRole = {
    ADMIN: 1,
    MANAGER: 2,
    COORDINATOR: 3,
    STUDENT: 4,
};

const SideBar = () => {
    const location = useLocation();
    const token = localStorage.getItem('token')
    const guest = localStorage.getItem('guest');
    const decoded = token ? jwtDecode(token) : null;
    const roleID = decoded?.roleID;

    const sidebarItems = [
        {
            role: [UserRole.ADMIN], 
            items: [
                { to: 'admin/dashboard', icon: 'fa-solid fa-house', label: 'Dashboard'},
                { to: 'admin/account', icon: 'fa-solid fa-user', label: 'Account' },
                { to: 'admin/faculty', icon: 'fa-solid fa-graduation-cap', label: 'Faculty' },
                { to: 'admin/event', icon: 'fa-regular fa-calendar', label: 'Event' },
                { to: 'admin/role', icon: 'fa-solid fa-user-secret', label: 'Role' },
            ]
        },
        {
            role: [UserRole.COORDINATOR], 
            items: [
                { to: 'coordinator/dashboard', icon: 'fa-solid fa-house', label: 'Dashboard'},
                { to: 'coordinator/event', icon: 'fa-solid fa-calendar', label: 'Event' },
            ]
        },
        {
            role: [UserRole.STUDENT], 
            items: [
                { to: 'student/event', icon: 'fa-solid fa-calendar', label: 'Event' },
            ]
        },
        {
            role: [UserRole.MANAGER], 
            items: [
                { to: 'manager/dashboard', icon: 'fa-solid fa-house', label: 'Dashboard'},
                { to: 'manager/event', icon: 'fa-solid fa-calendar', label: 'Event' },
            ]
        },
    ];

    return (
        <aside className="SideBar">
            <ul className="list-menu">
                {guest ? (
                    <li className="list-item active">
                        <Link to={'guest/public/'}>
                            <i className="fa-regular fa-folder-open"></i>
                            <span>List Contribution Public</span>
                        </Link>
                    </li>
                ) : (
                    sidebarItems?.map((group, index) => (
                        group.role.includes(roleID) && (
                            group.items.map((item, subIndex) => {
                                return (
                                    <li className={`list-item ${item.to === location.pathname ? 'active' : ''}`} key={`${index}-${subIndex}`}>
                                        <Link to={item.to}>
                                            <i className={`fa-solid ${item.icon}`}></i>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })
                        )
                    ))
                    
                    
                )}
            </ul>
        </aside>
    );
    
}

export default SideBar;
