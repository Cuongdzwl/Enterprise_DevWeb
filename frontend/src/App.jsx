import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React, { Suspense, lazy } from 'react';
import { jwtDecode } from 'jwt-decode';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import Loading from './components/Loading';

function App() {
    // Lazy load components and pages

    // Auth
    const LoginAM = lazy(() => import('./Page/Auth/LoginAM'));
    const Login = lazy(() => import('./Page/Auth/Login'));
    const ForgotPassword = lazy(() => import('./Page/General/ForgotPassword')); //ok
    const ResetPassword = lazy(() => import('./Page/General/ResetPassword'));
    const ChangePassword = lazy(() => import('./Page/General/ChangePassword'));

    // Profile
    const Profile = lazy(() => import('./Page/General/Profile'));

    // Dashboard
    const AdminDashboard = lazy(() => import('./Page/@admin/admin_dashboard'));
    const CoordinatorDashBoard = lazy(() => import('./Page/@coordinator/coordinator_dashboard'));
    const ManagerDashboard = lazy(() => import('./Page/@manager/manager_dashboard'));

    // Admin - Account
    const ListAccount = lazy(() => import('./Page/@admin/Account/ListAccount'));
    const CreateAccount = lazy(() => import('./Page/@admin/Account/CreateAccount'));
    const UpdateAccount = lazy(() => import('./Page/@admin/Account/UpdateAccount'));
    const DetailAccount = lazy(() => import('./Page/@admin/Account/DetailAccount'));

    // Admin - Faculty
    const ListFaculty = lazy(() => import('./Page/@admin/Faculty/ListFaculty'));
    const CreateFaculty = lazy(() => import('./Page/@admin/Faculty/CreateFaculty'));
    const UpdateFaculty = lazy(() => import('./Page/@admin/Faculty/UpdateFaculty'));
    const DetailFaculty = lazy(() => import('./Page/@admin/Faculty/DetailFaculty'));

    // Admin - Event
    const ListEvent = lazy(() => import('./Page/@admin/Event/ListEvent'));
    const CreateEvent = lazy(() => import('./Page/@admin/Event/CreateEvent'));
    const UpdateEvent = lazy(() => import('./Page/@admin/Event/UpdateEvent'));
    const DetailEvent = lazy(() => import('./Page/@admin/Event/DetailEvent'));

    // Admin - Role
    const ListRole = lazy(() => import('./Page/@admin/Role/ListRole'));
    const DetailRole = lazy(() => import('./Page/@admin/Role/DetailRole'));

    // Student - Event
    const ListEventS = lazy(() => import('./Page/@user/student/Event/ListEventS'));
    const DetailEventS = lazy(() => import('./Page/@user/student/Event/ADetailEventS'));

    // Student - Contribution
    const ListContributionS = lazy(() => import('./Page/@user/student/Contribution/ListContributionS'));
    const CreateContributionS = lazy(() => import('./Page/@user/student/Contribution/CreateContributionS'));
    const UpdateContributionS = lazy(() => import('./Page/@user/student/Contribution/UpdateContributionS'));
    const DetailContributionS = lazy(() => import('./Page/@user/student/Contribution/DetailContributionS'));

    // Coordinator - Event
    const ListEventC = lazy(() => import('./Page/@coordinator/Event/ListEventC'));
    const DetailEventC = lazy(() => import('./Page/@coordinator/Event/DetailEventC'));
    
    // Coordinator - Contribution
    const ListContributionC = lazy(() => import('./Page/@coordinator/Contribution/ListContributionC'));
    const UpdateContributionC = lazy(() => import('./Page/@coordinator/Contribution/UpdateContributionC'));
    const DetailContributionC = lazy(() => import('./Page/@coordinator/Contribution/DetailContributionC'));

    // Coordinator - Public
    const PublicContributionPC = lazy(() => import('./Page/@coordinator/Public/PublicContributionPC'));
    const DetailContributionPC = lazy(() => import('./Page/@coordinator/Public/DetailContributionPC'));

    // Manager - Event
    const ListEventM = lazy(() => import('./Page/@manager/Event/ListEventM'));
    const DetailEventM = lazy(() => import('./Page/@manager/Event/DetailEventM'));

    // Manager - Public
    const PublicContributionPM = lazy(() => import('./Page/@manager/Public/PublicContributionPM'));
    const DetailContributionPM = lazy(() => import('./Page/@manager/Public/DetailContributionPM'));

    // Guest - Public
    const PublicContributionG = lazy(() => import('./Page/@user/guest/PublicContributionG'));
    const DetailContributionG = lazy(() => import('./Page/@user/guest/DetailContributionG'));

    // General
    const NoAccess = lazy(() => import('./Page/General/NoAccess'));
    const Page404 = lazy(() => import('./Page/General/404'));



    // Check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('token');
    const guest = localStorage.getItem('guest');
    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                localStorage.clear();
                window.location.href = '/';
            }
        } else if (guest) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token, guest]);


    // Define user roles
    const UserRole = {
        ADMIN: 1,
        MANAGER: 2,
        COORDINATOR: 3,
        STUDENT: 4,
        GUEST: 5,
    };

    // Private route component that checks access before rendering
    const PrivateRoute = ({ element, allowedRoles }) => {
        const isLoggedIn = localStorage.getItem('token') || localStorage.getItem('guest');
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('guest'));
        const roleID = currentUser ? currentUser.RoleID : null;
        const roleGuest = currentUser ? currentUser.role : null;

        const checkAccess = () => {
            if (!isLoggedIn) return false;
            return allowedRoles.includes(roleID || roleGuest);
        }

        return checkAccess() ? element : <Navigate to="/no-access" replace />;
    }


    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth */}
                    <Route path='/' element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
                    <Route path='/staff' element={<Suspense fallback={<Loading />}><LoginAM /></Suspense>} />
                    <Route path='/forgotpassword' element={<Suspense fallback={<Loading />}><ForgotPassword /></Suspense>} />
                    <Route path='/resetpassword' element={<Suspense fallback={<Loading />}><ResetPassword /></Suspense>} />


                    {/* Private Routes */}
                    <Route
                        element={
                            isLoggedIn ? (
                                <>
                                    <NavBar />
                                    <div className="Container">
                                        <SideBar />
                                        <Outlet />
                                    </div>
                                </>
                            ) : (
                                isLoggedIn === false ? '' : <Loading />
                            )
                        }
                    >
                        {/* Admin */}
                        {/* Account */}
                        <Route path='/admin/account'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListAccount /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/account/create'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><CreateAccount /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/account/update/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><UpdateAccount /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/account/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailAccount /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />

                        {/* Faculty */}
                        <Route path='/admin/faculty'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListFaculty /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/faculty/create'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><CreateFaculty /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/faculty/update/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><UpdateFaculty /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/faculty/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailFaculty /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />

                        {/* Event */}
                        <Route path='/admin/event'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListEvent /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/event/create'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><CreateEvent /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/event/update/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><UpdateEvent /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/event/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailEvent /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />

                        {/* Role */}
                        <Route path='/admin/role'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListRole /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/admin/role/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailRole /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />

                        {/* Student */}
                        <Route path='/student/event'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListEventS /></Suspense>}
                                allowedRoles={[UserRole.STUDENT]} />} />
                        <Route path='/student/event/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailEventS /></Suspense>}
                                allowedRoles={[UserRole.STUDENT]} />} />
                        <Route path='/student/event/contribution/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListContributionS /></Suspense>} allowedRoles={[UserRole.STUDENT]} />} />
                        <Route path='/student/event/contribution/:id/create'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><CreateContributionS /></Suspense>} allowedRoles={[UserRole.STUDENT]} />} />
                        <Route path='/student/event/contribution/:id/update/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><UpdateContributionS /></Suspense>} allowedRoles={[UserRole.STUDENT]} />} />
                        <Route path='/student/event/contribution/:id/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailContributionS /></Suspense>} allowedRoles={[UserRole.STUDENT]} />} />

                        {/* Coordinator */}
                        <Route path='/coordinator/event'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListEventC /></Suspense>}
                                allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/event/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailEventC /></Suspense>}
                                allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/event/contribution/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListContributionC /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/event/contribution/:id/update/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><UpdateContributionC /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/event/contribution/:id/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailContributionC /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/public/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><PublicContributionPC /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/coordinator/public/:id/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailContributionPC /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />

                        {/* Manager */}
                        <Route path='/manager/event'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ListEventM /></Suspense>}
                                allowedRoles={[UserRole.MANAGER]} />} />
                        <Route path='/manager/event/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailEventM /></Suspense>}
                                allowedRoles={[UserRole.MANAGER]} />} />
                        <Route path='/manager/public/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><PublicContributionPM /></Suspense>} allowedRoles={[UserRole.MANAGER]} />} />
                        <Route path='/manager/public/:id/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailContributionPM /></Suspense>} allowedRoles={[UserRole.MANAGER]} />} />

                        {/* Guest */}
                        <Route path='/guest/public/'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><PublicContributionG /></Suspense>} allowedRoles={[UserRole.GUEST]} />} />
                        <Route path='/guest/public/detail/:id'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><DetailContributionG /></Suspense>} allowedRoles={[UserRole.GUEST]} />} />

                        {/* General */}
                        <Route path='/changepassword' element={<Suspense fallback={<Loading />}><ChangePassword /></Suspense>} />
                        <Route path='/profile' element={<Suspense fallback={<Loading />}><Profile /></Suspense>} />

                        {/*Dashboard */}
                        <Route path='/admin/dashboard'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><AdminDashboard /></Suspense>}
                                allowedRoles={[UserRole.ADMIN]} />} />
                        <Route path='/coordinator/dashboard'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><CoordinatorDashBoard /></Suspense>} allowedRoles={[UserRole.COORDINATOR]} />} />
                        <Route path='/manager/dashboard'
                            element={<PrivateRoute element={<Suspense fallback={<Loading />}><ManagerDashboard /></Suspense>} allowedRoles={[UserRole.MANAGER]} />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<Suspense fallback={<Loading />}><Page404 /></Suspense>} />
                    {/* No access */}
                    <Route path="/no-access" element={<Suspense fallback={<Loading />}><NoAccess /></Suspense>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
