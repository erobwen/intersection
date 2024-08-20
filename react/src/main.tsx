import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

export const production = import.meta.env.PROD;
export const apiPort = production ? 3001 : 3000;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
