import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import '../styles/globals.css'

// Log da versão para debug
console.log('🚀 Dashboard RN 518 v1.0.0 - Iniciando...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)