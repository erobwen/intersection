import { lazy } from 'react';

const IntersectionGUI = lazy(() => import('./pages/IntersectionGUI'));

export const production = import.meta.env.PROD;
export const apiPort = production ? 3001 : 3000;

function App() {
  return (
    <IntersectionGUI/>
  )
}

export default App
