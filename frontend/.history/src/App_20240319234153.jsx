import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import ListAccount from "./Page/@admin/Account/ListAccount"

function App() {
  return (
    <>
      <Router>
        <main className="App">
          <NavBar />
          <div className="content">

            
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
