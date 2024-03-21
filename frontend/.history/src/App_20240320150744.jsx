import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import Heading from "./components/Heading";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';

const crud = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  detail: 'Detail',
  list: 'List'
};

const title = {
  account: 'Account',
  dashboard: 'Dashboard',
  event: 'Event',
  faculty: 'Faculty',
  homepage: 'Home page'
};

const button = {
  create: 'Create',
  public: 'Public Contribution'
};

const contentType = {
  default: 'row-2',
  list: 'row-2 list',
};

// Admin Account
const accountTitle = `${crud.list} ${title.account}`;
const accountCreateTitle = `${crud.create} ${title.account}`;
const accountUpdateTitle = `${crud.update} ${title.account}`;
const accountDetailTitle = `${crud.detail} ${title.account}`;


const dashboardTitle = `${crud.list} ${title.dashboard}`;
const eventTitle = `${crud.list} ${title.event}`;
const facultyTitle = `${crud.list} ${title.faculty}`;
const homepageTitle = `${crud.list} ${title.homepage}`;
const createAccountButton = button.create;


const renderRoute = (path, routeTitle, routeButton, contentType, component, showSearch, showCreate, placeholder, s, redirect) => (
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