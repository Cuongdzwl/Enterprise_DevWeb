import NavBar from "./components/NavBar"

function App() {
  return (
    <>
      <main className="App">
        <NavBar />
        <div className="Container">
          <Router>
            <div className="App">
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
            </div>
          </Router>
        </div>
      </main>
    </>
  )
}

export default App
