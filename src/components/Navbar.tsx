import { Link, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const Navbar = () => {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Brand */}
        <Link 
          to="/home" 
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1a202c',
            textDecoration: 'none'
          }}
        >
          Project Tracker
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>            {user && (
            <>
              <Link 
                to="/home" 
                style={{
                  color: '#4a5568',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Home
              </Link>
              <Link 
                to="/search" 
                style={{
                  color: '#4a5568',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Search
              </Link>
              <Link 
                to="/chat" 
                style={{
                  color: '#4a5568',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Chat
              </Link>
              <Link 
                to="/profile" 
                style={{
                  color: '#4a5568',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Profile
              </Link>
            </>
          )}

          {/* User Actions */}
          {loading ? (
            <div style={{ color: '#718096' }}>Loading...</div>
          ) : user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ color: '#4a5568' }}>
                {user.displayName || user.email}
              </span>              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c53030'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#e53e3e'}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Link 
                to="/login"
                style={{
                  color: '#4a5568',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                style={{
                  backgroundColor: '#3182ce',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar