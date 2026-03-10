import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from './admin';
import Dashboard from './dashboard';
import Orders from './orders';
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
