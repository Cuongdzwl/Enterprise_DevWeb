import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import Heading from "./components/Heading";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';
import { accountTitle, accountCreateTitle, accountUpdateTitle, accountDetailTitle, createAccountButton, defaultContentType,  } from './config'



const renderRoute = (path, routeTitle, routeButton, contentType, component, showSearch, showCreate, placeholder, redirect) => (
  <Route
    path={path}
    element={
      <>
        <Heading
          title={routeTitle}
          showSearch={showSearch}
          showCreate={showCreate}
          button={routeButton}
          redirect={redirect}
          placeholder={placeholder} />
        <div className={contentType}>
          {component}
        </div>
      </>
    }
  />
);

function App() {
  const renderAccountRoutes = () => {
    return (
      <>
        {renderRoute('/admin/account', accountTitle, createAccountButton, contentType.list, <ListAccount />, true, true, accountTitle, '/admin/account/create')}
        {renderRoute('/admin/account/create', accountCreateTitle, null, contentType.default, <CreateAccount />, false, false, '')}
        {renderRoute('/admin/account/update/:id', accountUpdateTitle, null, contentType.default, <UpdateAccount />, false, false, '')}
        {renderRoute('/admin/account/detail/:id', accountDetailTitle, null, contentType.default, <DetailAccount />, false, false, '')}
      </>
    );
  };


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