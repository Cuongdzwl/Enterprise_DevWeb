import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import ListAccount from "./Page/@admin/Account/ListAccount";
import CreateAccount from "./Page/@admin/Account/CreateAccount";
import Heading from "./components/Heading";
import UpdateAccount from './Page/@admin/Account/UpdateAccount';
import DetailAccount from './Page/@admin/Account/DetailAccount';
import { accountTitle, accountCreateTitle, accountUpdateTitle, accountDetailTitle, createAccountButton, defaultContentType, listContentType } from './config'

const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };


const renderRoute = (path, routeTitle, routeButton, contentType, component, showSearch, showCreate, placeholder,onSearchChange, redirect) => (
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
          placeholder={placeholder}
          onSearchChange
        />
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
          
        {renderRoute('/admin/account/create', accountCreateTitle, null, defaultContentType, <CreateAccount />, false, false, '')}
        {renderRoute('/admin/account/update/:id', accountUpdateTitle, null, defaultContentType, <UpdateAccount />, false, false, '')}
        {renderRoute('/admin/account/detail/:id', accountDetailTitle, null, defaultContentType, <DetailAccount />, false, false, '')}
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