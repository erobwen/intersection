import { lazy } from 'react';

const IntersectionGUI = lazy(() => import('./pages/IntersectionGUI'));

function App() {
  return (
    <IntersectionGUI/>
  )
}

export default App
