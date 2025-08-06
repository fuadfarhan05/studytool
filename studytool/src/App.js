import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard'; 
import StudyTable from './pages/studytable';
import Flashcard from './pages/flashcard';
import Upload from './pages/upload';
import CreateCards from './component/createcards';
import MyStuff from './component/mystuff';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img alt="" src="LENSE.png"></img>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/studytable" element={<StudyTable />} />
            <Route path="/flashcards" element={<Flashcard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/createcards" element={<CreateCards />} />
            <Route path="/mystuff" element={<MyStuff />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;