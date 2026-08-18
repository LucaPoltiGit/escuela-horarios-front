import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/common/NavBar'
import { APP_TEXT } from './constants/text'
import { ROUTES } from './constants/routes'
import HealthPage from './pages/HealthPage'
import EscuelasPage from './pages/EscuelasPage'
import EscuelaDetallePage from './pages/EscuelaDetallePage'
import BloquesPage from './pages/BloquesPage'
import GradosPage from './pages/GradosPage'
import EnConstruccionPage from './pages/EnConstruccionPage'

const SECCIONES = APP_TEXT.escuelas.secciones

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path={ROUTES.salud} element={<HealthPage />} />
        <Route path={ROUTES.escuelas} element={<EscuelasPage />} />
        <Route path={ROUTES.escuelaDetalle} element={<EscuelaDetallePage />} />
        <Route path={ROUTES.escuelaBloques} element={<BloquesPage />} />
        <Route path={ROUTES.escuelaGrados} element={<GradosPage />} />
        <Route
          path={ROUTES.escuelaMaterias}
          element={<EnConstruccionPage nombreSeccion={SECCIONES.materias} />}
        />
        <Route
          path={ROUTES.escuelaDocentes}
          element={<EnConstruccionPage nombreSeccion={SECCIONES.docentes} />}
        />
        <Route
          path={ROUTES.escuelaGenerarHorario}
          element={<EnConstruccionPage nombreSeccion={SECCIONES.generarHorario} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
