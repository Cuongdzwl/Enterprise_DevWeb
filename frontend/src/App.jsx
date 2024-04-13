import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import { jwtDecode } from 'jwt-decode';

// Admin - Account
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';

// Admin - Faculty
import ListFaculty from './Page/@admin/Faculty/ListFaculty';
import CreateFaculty from './Page/@admin/Faculty/CreateFaculty';
import UpdateFaculty from './Page/@admin/Faculty/UpdateFaculty';
import DetailFaculty from './Page/@admin/Faculty/DetailFaculty';

// Admin - Event
import ListEvent from './Page/@admin/Event/ListEvent';
import CreateEvent from './Page/@admin/Event/CreateEvent';
import UpdateEvent from './Page/@admin/Event/UpdateEvent';
import DetailEvent from './Page/@admin/Event/DetailEvent';


// Admin - Role
import ListRole from './Page/@admin/Role/ListRole';
import CreateRole from './Page/@admin/Role/CreateRole';
import UpdateRole from './Page/@admin/Role/UpdateRole';
import DetailRole from './Page/@admin/Role/DetailRole';

// Student - Event
import ListEventS from './Page/@user/student/Event/ListEventS';
import DetailEventS from './Page/@user/student/Event/ADetailEventS'

// Student - Contribution
import ListContributionS from './Page/@user/student/Contribution/ListContributionS';
import CreateContributionS from './Page/@user/student/Contribution/CreateContributionS';
import UpdateContributionS from './Page/@user/student/Contribution/UpdateContributionS';
import DetailContributionS from './Page/@user/student/Contribution/DetailContributionS';

// Coordinators - Event
import ListEventC from './Page/@coordinator/Event/ListEventC';
import DetailEventC from './Page/@coordinator/Event/DetailEventC';

// Coordinators - Contribution
import ListContributionC from './Page/@coordinator/Contribution/ListContributionC';
import UpdateContributionC from './Page/@coordinator/Contribution/UpdateContributionC';
import DetailContributionC from './Page/@coordinator/Contribution/DetailContributionC';

// Coordinators - Public
import PublicContributionPC from './Page/@coordinator/Public/PublicContributionPC';
import DetailContributionPC from './Page/@coordinator/Public/DetailContributionPC';

// Manager - Event
import ListEventM from './Page/@manager/Event/ListEventM';
import DetailEventM from './Page/@manager/Event/DetailEventM';

// Manager - Public
import PublicContributionPM from './Page/@manager/Public/PublicContributionPM';
import DetailContributionPM from './Page/@manager/Public/DetailContributionPM';

// Guest - Public
import PublicContributionG from './Page/@user/guest/PublicContributionG';
import DetailContributionG from './Page/@user/guest/DetailContributionG';

// Auth
import LoginAM from './Page/Auth/LoginAM';
import Login from './Page/Auth/Login';
import ChangePassword from './Page/General/ChangePassword';
import Profile from './Page/General/Profile';
import Loading from './components/Loading';
import ForgotPassword from './Page/General/ForgotPassword';
import ResetPassword from './Page/General/ResetPassword';

// Dashboard
import AdminDashboard from "./Page/@admin/admin_dashboard.jsx";
import CoordinatorDashBoard from './Page/@coordinator/coordinator_dashboard';
import ManagerDashboard from './Page/@manager/manager_dashboard';

import NoAccess from './Page/General/NoAccess';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('token');
    const guest = localStorage.getItem('guest');

    useEffect(() => {
        if (token) {
            setIsLoggedIn(!!token)
        }
        if (guest) {
            setIsLoggedIn(!!guest)
        }

        // Redirect login
        if (window.location.pathname === '/') {
            window.location.href = '/login/';
        }

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                localStorage.clear()
                window.location.href = '/login/';
            }
        }
    }, []);

    // Define user roles
    const UserRole = {
        ADMIN: 1,
        MANAGER: 2,
        COORDINATOR: 3,
        STUDENT: 4,
        GUEST: 5,
    };

    // Current role
    const currentUser = localStorage.getItem('currentUser')
    const roleID = currentUser ? JSON.parse(currentUser).RoleID : null;
    const roleGuest = guest ? JSON.parse(guest).role : null;

    // Function to check if user has access to a specific route
    const checkAccess = (allowedRoles) => {
        return allowedRoles.includes(roleID || roleGuest);
    }

    // Private route component that checks access before rendering
    const PrivateRoute = ({ element, allowedRoles }) => {
        return checkAccess(allowedRoles) ? element : <Navigate to="/no-access" replace />;
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth */}
                    <Route path='/login/' element={<Login />} />
                    <Route path='/login/admin' element={<LoginAM />} />
                    <Route path='/forgotpassword' element={<ForgotPassword />} />
                    <Route path='/resetpassword' element={<ResetPassword />} />

                    {/* No access */}
                    <Route path="/no-access" element={<NoAccess />} />

                    <Route
                        path="*"
                        element={
                            isLoggedIn ? (
                                <>
                                    <NavBar />
                                    <div className="Container">
                                        <SideBar />
                                        <Routes>
                                            {/* Admin */}
                                            {/* Account */}
                                            <Route path='/admin/account'
                                                element={<PrivateRoute element={<ListAccount />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/account/create'
                                                element={<PrivateRoute element={<CreateAccount />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/account/update/:id'
                                                element={<PrivateRoute element={<UpdateAccount />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/account/detail/:id'
                                                element={<PrivateRoute element={<DetailAccount />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />

                                            {/* Faculty */}
                                            <Route path='/admin/faculty'
                                                element={<PrivateRoute element={<ListFaculty />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/faculty/create'
                                                element={<PrivateRoute element={<CreateFaculty />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/faculty/update/:id'
                                                element={<PrivateRoute element={<UpdateFaculty />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/faculty/detail/:id'
                                                element={<PrivateRoute element={<DetailFaculty />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />

                                            {/* Event */}
                                            <Route path='/admin/event'
                                                element={<PrivateRoute element={<ListEvent />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/event/create'
                                                element={<PrivateRoute element={<CreateEvent />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/event/update/:id'
                                                element={<PrivateRoute element={<UpdateEvent />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/event/detail/:id'
                                                element={<PrivateRoute element={<DetailEvent />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />

                                            {/* Role */}
                                            <Route path='/admin/role'
                                                element={<PrivateRoute element={<ListRole />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/role/create'
                                                element={<PrivateRoute element={<CreateRole />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/role/update/:id'
                                                element={<PrivateRoute element={<UpdateRole />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/admin/role/detail/:id'
                                                element={<PrivateRoute element={<DetailRole />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />

                                            {/* Student */}
                                            <Route path='/student/event'
                                                element={<PrivateRoute element={<ListEventS />}
                                                    allowedRoles={[UserRole.STUDENT]} />} />
                                            <Route path='/student/event/detail/:id'
                                                element={<PrivateRoute element={<DetailEventS />}
                                                    allowedRoles={[UserRole.STUDENT]} />} />
                                            <Route path='/student/event/contribution/:id'
                                                element={<PrivateRoute element={<ListContributionS />} allowedRoles={[UserRole.STUDENT]} />} />
                                            <Route path='/student/event/contribution/:id/create'
                                                element={<PrivateRoute element={<CreateContributionS />} allowedRoles={[UserRole.STUDENT]} />} />
                                            <Route path='/student/event/contribution/:id/update/:id'
                                                element={<PrivateRoute element={<UpdateContributionS />} allowedRoles={[UserRole.STUDENT]} />} />
                                            <Route path='/student/event/contribution/:id/detail/:id'
                                                element={<PrivateRoute element={<DetailContributionS />} allowedRoles={[UserRole.STUDENT]} />} />

                                            {/* Coordinator */}
                                            <Route path='/coordinator/event'
                                                element={<PrivateRoute element={<ListEventC />}
                                                    allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/event/detail/:id'
                                                element={<PrivateRoute element={<DetailEventC />}
                                                    allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/event/contribution/:id'
                                                element={<PrivateRoute element={<ListContributionC />} allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/event/contribution/:id/update/:id'
                                                element={<PrivateRoute element={<UpdateContributionC />} allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/event/contribution/:id/detail/:id'
                                                element={<PrivateRoute element={<DetailContributionC />} allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/public/:id'
                                                element={<PrivateRoute element={<PublicContributionPC />} allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/coordinator/public/:id/detail/:id'
                                                element={<PrivateRoute element={<DetailContributionPC />} allowedRoles={[UserRole.COORDINATOR]} />} />

                                            {/* Manager */}
                                            <Route path='/manager/event'
                                                element={<PrivateRoute element={<ListEventM />}
                                                    allowedRoles={[UserRole.MANAGER]} />} />
                                            <Route path='/manager/event/detail/:id'
                                                element={<PrivateRoute element={<DetailEventM />}
                                                    allowedRoles={[UserRole.MANAGER]} />} />
                                            <Route path='/manager/public/:id'
                                                element={<PrivateRoute element={<PublicContributionPM />} allowedRoles={[UserRole.MANAGER]} />} />
                                            <Route path='/manager/public/:id/detail/:id'
                                                element={<PrivateRoute element={<DetailContributionPM />} allowedRoles={[UserRole.MANAGER]} />} />

                                            {/* Guest */}
                                            <Route path='/guest/public/'
                                                element={<PrivateRoute element={<PublicContributionG />} allowedRoles={[UserRole.GUEST]} />} />
                                            <Route path='/guest/public/detail/:id'
                                                element={<PrivateRoute element={<DetailContributionG />} allowedRoles={[UserRole.GUEST]} />} />

                                            {/* General */}
                                            <Route path='/changepassword' element={<ChangePassword />} />
                                            <Route path='/profile' element={<Profile />} />

                                            {/*Dashboard */}
                                            <Route path='/admin/dashboard'
                                                element={<PrivateRoute element={<AdminDashboard />}
                                                    allowedRoles={[UserRole.ADMIN]} />} />
                                            <Route path='/coordinator/dashboard'
                                                element={<PrivateRoute element={<CoordinatorDashBoard />} allowedRoles={[UserRole.COORDINATOR]} />} />
                                            <Route path='/manager/dashboard'
                                                element={<PrivateRoute element={<ManagerDashboard />} allowedRoles={[UserRole.MANAGER]} />} />
                                        </Routes>
                                    </div>
                                </>
                            ) : (
                                isLoggedIn === false ? '' : <Loading />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
