import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import Narbar from './components/client/navbar/Navbar.js'
import Navbar_2 from './components/client/navbar/Navbar_2'
import Main_Background from './pages/Home/tsx/Main_Background'
import Content_1 from './pages/Home/tsx/content_1'
import Content_2 from './pages/Home/tsx/content_2'
import Content_3 from './pages/Home/tsx/content_3'
import Content_4 from './pages/Home/tsx/content_4'
import Contact from './pages/Home/tsx/contact'
import Footer from './components/client/footer/footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Narbar />
    <Navbar_2 />
    <Main_Background />
    <Content_1 />
    <Content_2 />
    <Content_3 />
    <Content_4 />
    <Contact />
    <Footer /> */}
    <App />
  </StrictMode>,
)
