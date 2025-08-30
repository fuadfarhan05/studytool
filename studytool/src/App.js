import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import StudyTable from './pages/studytable';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/studytable" element={<StudyTable />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;