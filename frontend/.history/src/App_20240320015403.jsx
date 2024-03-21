import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import SideBar from './components/SideBar'
import ListAccount from "./Page/@admin/Account/ListAccount"
import Heading from "./components/Heading"

const crud = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  list: 'List'
}

const title = {
  account: 'Account',
  dashboard: 'Dashboard',
  event: 'Event',
  faculty: 'Faculty',
  homepage: 'Home page'
}

const button = {
  create: 'Create',
  public: 'Public Contribution'
}

const Content = {
  default: 'row-2',
  list: 'row-2 list',
}

const renderRoute = (path, routeTitle, routeButton) => (
  <Route
    path={path}
    element={
      <>
        <Heading
          title={`${crud[routeTitle]}
          ${title.account}`}
          showSearch={false}
          showCreate={false}
          button={routeButton} redirect={`/admin/account/create`} />
        <div className={Content.list}>
          <ListAccount />
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
                {renderRoute("/admin/account", "list", button.create)}
                {renderRoute("/admin/account/create", "create", null)}
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
