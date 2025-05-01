import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { clearToken } = useAuth(); 

  const handleLogout = () => {
    // Clear token and role using context
    clearToken();

   
    localStorage.removeItem('token'); 

    
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        background: 'crimson',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
