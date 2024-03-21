import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"


function App() {
  return (
    <>
      <Router>
        <main className="App">
          <NavBar />
          <div className="content">
            <Routes>
              
            </Routes>
          </div>
        </main>
      </Router>
    </>
  )
}

export default App
