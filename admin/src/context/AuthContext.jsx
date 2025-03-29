import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
     
    fetch(`${apiBaseURL}/auth/refresh`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          navigate('/login');
        }
        return res.json();
      })
      .then(json => {
        setUser(json.data.user);
      })
      .catch(() => {
        setUser({});
        navigate('/login');
      });
    return;

  }, []);

  const context = {
    user,
    setUser
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  const { user, setUser } = useContext(AuthContext);
  return [user, setUser];
}
