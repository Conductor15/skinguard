import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from './components/tsx/Navbar'
import Navbar_2 from './components/tsx/Navbar_2'
import Footer from './components/tsx/footer'
import Home from "./pages/Home/tsx/Home";

function App() {
  return (
    <Router>
      <Navbar/>
      <Navbar_2 />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
