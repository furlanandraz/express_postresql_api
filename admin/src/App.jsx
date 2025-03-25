import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./layouts/Login";
import Dashboard from "./layouts/Dashboard";
// import './App.css'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<p>404 Not Found</p>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
