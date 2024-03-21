import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import SideBar from './components/SideBar'
import ListAccount from "./Page/@admin/Account/ListAccount"
import Heading from "./components/Heading"

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


function App() {
  return (
    <>
      <Router>
        <main className="App">
          <NavBar />
          <div className="Container">
            <SideBar />
            <div className="Content">
              <div className="container">
                <Routes>
                  <Route
                    path="/admin/account"
                    element={
                      <>
                        <Heading title={`List ${title.account}`} button={button.create} redirect={`/admin/account/create`} />
                        <div className={Content.list}>
                          <ListAccount />
                        </div>
                      </>
                    }
                  />
                  <Route
                    path='/admin/account/create'
                    element={
                      <>
                        <Heading title={title.account} button={button.create} redirect={`/admin/account/create`} />
                        <div className={Content.list}>
                          <ListAccount />
                        </div>
                      </>
                    }
                  />
                  {/* Add other routes here */}
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </Router>
    </>
  )
}

export default App;
