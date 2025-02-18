import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Employees from './pages/Employees'
import Assignments from './pages/Assignments'
import Landing from './pages/Landing'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-10">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/employees" element={<Employees />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
