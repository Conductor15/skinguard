import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home/tsx/Home";
import Dashboard from "./pages/managers/tsx/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
