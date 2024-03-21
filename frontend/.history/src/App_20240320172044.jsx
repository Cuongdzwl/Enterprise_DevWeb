import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';


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
import { render } from 'react-dom';




function App() {
  const renderAccountRoutes = () => {
    return (
      <>
        <Route path='/admin/account' element={<ListAccount />} />
        <Route path='/admin/account/create' element={<CreateAccount />} />
        <Route path='/admin/account/update/:id' element={<UpdateAccount />} />
        <Route path='/admin/account/detail/:id' element={<DetailAccount />} />
      </>
    );
  };

  const renderFacultyRoutes = () => {
    return (
      <>
        <Route path='/admin/faculty' element={<ListFaculty />} />
        <Route path='/admin/faculty/create' element={<CreateFaculty />} />
        <Route path='/admin/faculty/update/:id' element={<UpdateFaculty />} />
        <Route path='/admin/faculty/detail/:id' element={<DetailFaculty />} />
      </>
    )
  }

  const renderEventRoutes = () => {
    return (
      <>
        <Route path='/admin/event' element={<ListEvent />} />
        <Route path='/admin/event/create' element={<CreateEvent />} />
        <Route path='/admin/event/update/:id' element={<UpdateEvent />} />
        <Route path='/admin/event/detail/:id' element={<DetailEvent />} />
      </>
    )
  }



  return (
    <Router>
      <main className="App">
        <NavBar />
        <div className="Container">
          <SideBar />
          <div className="Content">
            <div className="container">
              <Routes>
                {/* Admin */}
                {renderAccountRoutes()}
                {renderFacultyRoutes()}
                {renderEventRoutes()}
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;
