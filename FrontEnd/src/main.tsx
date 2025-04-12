import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import Narbar from './components/Narbar.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Narbar />
  </StrictMode>,
)
