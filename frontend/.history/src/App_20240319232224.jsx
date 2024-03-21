import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <main className="App">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/update/:id" element={<Update />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </Router>
    </>
  )
}

export default App
