import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <>
      <Router>
        <main className="App">
          <NavBar />
          <div className="content">
            
          </div>
        </main>
      </Router>
    </>
  )
}

export default App
