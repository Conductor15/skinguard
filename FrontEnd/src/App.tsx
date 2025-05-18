import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home/tsx/Home";
import Dashboard from "./pages/managers/tsx/Dashboard";
import Diagnose_Manager from "./pages/managers/tsx/Diagnose_Manager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/dashboard/diagnose_manager" element={<Diagnose_Manager/>} />
      </Routes>
    </Router>
  )
}

export default App
