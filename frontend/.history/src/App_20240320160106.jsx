import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';


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
                {renderAccountRoutes()}


              </Routes>
            </div>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;
