import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import Narbar from './components/Navbar.js'
import Navbar_2 from './components/Navbar_2'
import Main_Background from './components/Main_Background'
import Content_1 from './components/content_1'
import Content_2 from './components/content_2'
import Content_3 from './components/content_3'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Narbar />
    <Navbar_2 />
    <Main_Background />
    <Content_1 />
    <Content_2 />
    <Content_3 />
  </StrictMode>,
)
