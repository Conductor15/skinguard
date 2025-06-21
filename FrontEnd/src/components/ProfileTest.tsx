import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/Axios';

const ProfileTest: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/auth/account');
      setProfile(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/register-login?mode=login';
    } catch (err) {
      // Logout locally even if API fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/register-login?mode=login';
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Protected Profile Page</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchProfile} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Profile'}
        </button>
        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {profile && (
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <h3>Profile Data:</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>How to test:</strong></p>
        <ol>
          <li>Register a new account</li>
          <li>Login with that account</li>
          <li>This page should load your profile</li>
          <li>Token should auto-refresh when expired</li>
          <li>Logout should clear tokens and redirect</li>
        </ol>
      </div>
    </div>
  );
};

export default ProfileTest;
