import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import ReadOnlyTable from './components/ReadOnlyTable'
import Register from './pages/Register'
import Login from './pages/Login'
import { AuthProvider } from './context/UserAuth'
import ProtectedRoute from './components/Redirects/ProtectedRoute'
import UserProfile from './pages/UserProfile'
import UserProfileUpdate from './pages/UserProfileUpdate'

function App() {

  return (
    <>
      <AuthProvider>
        <div className="App">
          <Navbar
            content = {
              <Routes>
                <Route path="/" element={<ReadOnlyTable />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/profile-update" element={<ProtectedRoute><UserProfileUpdate /></ProtectedRoute>} />
              </Routes>
            }
          />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
