import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import Narbar from './components/Navbar.js'
import Navbar_2 from './components/Navbar_2'
import Main_Background from './components/Main_Background'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Narbar />
    <Navbar_2 />
    <Main_Background />
  </StrictMode>,
)
