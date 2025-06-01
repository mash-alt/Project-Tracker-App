import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { searchUsers, getAllUsers } from '../services/userService';
import type { User as AppUser } from '../types/User';
import '../styles/Search.css';

const Search = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Load all users on component mount
  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const users = await getAllUsers(20);
        setAllUsers(users.filter(u => u.uid !== user?.uid)); // Exclude current user
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users');
      }
    };

    if (user) {
      loadAllUsers();
    }
  }, [user]);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const results = await searchUsers(term);
      setSearchResults(results.filter(u => u.uid !== user?.uid)); // Exclude current user
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const displayUsers = searchTerm.trim() ? searchResults : allUsers;
  const getProfilePicture = (user: AppUser) => {
    if (user.photoURL) {
      return user.photoURL;
    }
    // Use default avatar
    return '/src/assets/profilePictures/avatar-1295394_1280.webp';
  };

  if (loading) {
    return (
      <div className="search-container">
        <div className="search-loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="search-container">
      <div className="search-content">
        <h1 className="search-title">Find People</h1>
        
        {/* Search Input */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {isSearching && <div className="search-spinner">🔍</div>}
        </div>

        {/* Error Message */}
        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {/* Results Header */}
        <div className="search-results-header">
          {searchTerm.trim() ? (
            <h2>Search Results ({searchResults.length})</h2>
          ) : (
            <h2>Suggested People ({allUsers.length})</h2>
          )}
        </div>

        {/* User List */}
        <div className="users-list">
          {displayUsers.length === 0 ? (
            <div className="no-results">
              {searchTerm.trim() ? 'No users found' : 'No users available'}
            </div>
          ) : (
            displayUsers.map((searchUser) => (
              <div key={searchUser.uid} className="user-card">
                <div className="user-card-content">
                  <img
                    src={getProfilePicture(searchUser)}
                    alt={searchUser.displayName || 'User'}
                    className="user-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/src/assets/profilePictures/avatar-1295394_1280.webp';
                    }}
                  />
                  <div className="user-info">
                    <h3 className="user-name">
                      {searchUser.displayName || 'Anonymous User'}
                    </h3>
                    <p className="user-email">{searchUser.email}</p>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="connect-button">
                    Connect
                  </button>
                  <button className="message-button">
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
