import { lazy } from 'react';

import './App.css'

const IntersectionGUI = lazy(() => import('./pages/IntersectionGUI'));

function App() {
  return (
    <IntersectionGUI/>
  )
}

export default App
