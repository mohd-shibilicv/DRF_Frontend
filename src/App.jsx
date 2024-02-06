import { useState } from 'react'
import HelloWorld from './components/HelloWorld'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import ReadOnlyTable from './components/ReadOnlyTable'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {

  return (
    <>
      <div className="App">
        <Navbar
          content = {
            <Routes>
              <Route path="/" element={<ReadOnlyTable />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          }
        />
      </div>
    </>
  )
}

export default App
