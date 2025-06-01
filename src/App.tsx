import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/App.css'
import Navbar from './components/Navbar'
import HomeFeed from './pages/HomeFeed'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Search from './pages/Search'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
