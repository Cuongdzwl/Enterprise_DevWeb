import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import SideBar from './components/SideBar'
import ListAccount from "./Page/@admin/Account/ListAccount"
import Heading from "./components/Heading"

const title = {
  
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
                <Heading title='' />
              </div>
            </div>
            {/* <Routes>
              <Route path="/admin/account" element={<ListAccount />} />
            </Routes> */}

          </div>
        </main>
      </Router>
    </>
  )
}

export default App
