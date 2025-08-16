import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './Upload';
import Login from './Login';
import Audit from './Audit';
import NewDashboard from './NewDashboard';
import NewView from './NewView';
import NewUpdate from './NewUpdate';
import Search from './Search';


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={ <UploadPage /> } />
        <Route path="/audit" element={ <Audit />} />
        <Route path="/NewDashboard" element={<NewDashboard /> } />
        <Route path="/NewView" element={ <NewView /> } />
        <Route path="/NewUpdate" element={<NewUpdate /> } />
        <Route path="/Search" element={ <Search /> } />
      </Routes>
    </Router>
  );
}

export default App;
