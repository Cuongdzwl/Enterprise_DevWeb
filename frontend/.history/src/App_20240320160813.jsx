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
    <> 
      <Route path='/admin/faculty' element={<ListFaculty} />
      {/* <Route path='/admin/faculty/create' element={<CreateFaculty />} />
      <Route path='/admin/faculty/update/:id' element={<UpdateFaculty />} />
      <Route path='/admin/faculty/detail/:id' element={<DetailFaculty />} /> */}
    </>
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
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;
