import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/common/NavBar'
import { ROUTES } from './constants/routes'
import HealthPage from './pages/HealthPage'
import EscuelasPage from './pages/EscuelasPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path={ROUTES.salud} element={<HealthPage />} />
        <Route path={ROUTES.escuelas} element={<EscuelasPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
