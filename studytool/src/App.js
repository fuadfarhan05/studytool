import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard'; 
import StudyTable from './pages/studytable';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h2>Lense</h2>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/studytable" element={<StudyTable />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;