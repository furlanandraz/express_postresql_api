import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./ui/layouts/Login";
import Dashboard from "./ui/layouts/Dashboard";

import Navigation from "./ui/views/Navigation";

import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="navigation" element={<Navigation />} />
          </Route>
          <Route path="*" element={<p>404 Not Found</p>} /> 
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
