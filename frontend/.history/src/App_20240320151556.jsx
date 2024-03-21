import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from "./components/NavBar";
import SideBar from './components/SideBar';
import Routes from './Routes';

const App = () => {
  return (
    <Router>
      <main className="App">
        <NavBar />
        <div className="Container">
          <SideBar />
          <div className="Content">
            <div className="container">
              <Routes />
            </div>
          </div>
        </div>
      </main>
    </Router>
  );
}

export default App;
