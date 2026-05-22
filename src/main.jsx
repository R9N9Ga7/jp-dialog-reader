import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH ?? "/"}>
      <Routes>
        <Route path='/' element={ <App /> } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
