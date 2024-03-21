import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import Heading from "./components/Heading";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';

const crud = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
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

const renderRoute = (path, routeTitle, routeButton, contentType, component, showSearch, showCreate, redirect) => (
  <Route
    path={path}
    element={
      <>
        <Heading
          title={`${crud[routeTitle]} ${title.account}`}
          showSearch={showSearch}
          showCreate={showCreate}
          button={routeButton}
          redirect={redirect} />
        <div className={contentType}>
          {component}
        </div>
      </>
    }
  />
);

function App() {
  return (
    <Router>
      <main className="App">
        <NavBar />
        <div className="Container">
          <SideBar />
          <div className="Content">
            <div className="container">
              <Routes>
                {renderRoute('/admin/account', 'list', button.create, contentType.list, <ListAccount />, true, true, '/admin/account/create')}
                {renderRoute('/admin/account/create', 'create', null, contentType.default, <CreateAccount />, false, false, '')}
                {renderRoute('/admin/account/update/:id', 'update', null, contentType.default, <UpdateAccount />, false, false, '')}
                {renderRoute('/admin/account/detail/:id', 'update', null, contentType.default, < De/>, false, false, '')}


                {/* {renderRoute('/admin/other', 'other', button.create, <OtherComponent />)} */}
                {/* Add other routes here */}
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;