import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import Home 


function App() {
  return (
    <>
      <Router>
        <main className="App">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/faculity" element={<Faculity />} />
              <Route path="/event" element={<Event />} />
            </Routes>
          </div>
        </main>
      </Router>
    </>
  )
}

export default App
