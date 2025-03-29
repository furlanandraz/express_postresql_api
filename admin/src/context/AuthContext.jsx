import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie;

    const hasAccessToken = cookies.includes('accessToken=');
    const hasRefreshToken = cookies.includes('refreshToken=');
    const rawPermissions = document.cookie.match(/permissions=([^;]+)/)?.[1];
  
    console.log(hasAccessToken, hasRefreshToken, rawPermissions)

    if (rawPermissions) {
      try {
        setPermissions(JSON.parse(decodeURIComponent(rawPermissions)));
      } catch {
        setPermissions([]);
      }
    }
  

    if (hasAccessToken) return;

    if (hasRefreshToken) {
      
      fetch(`${apiBaseURL}/auth/refresh`, {
        credentials: 'include'
      })
        .then(res => {
          console.log(res.status)
          if (!res.ok) {
            navigate('/login');
            // throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then(data => {
          setPermissions(data.permissions);
          setUser(data.user);
          navigate('/dashboard');
        })
        .catch(() => {
          setPermissions([]);
          setUser(null);
        });
      return;
    }

   
    navigate('/login');
    // throw new Error('Unauthorized');
  
  }, []);

  const context = {
    permissions,
    setPermissions,
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

export function usePermissions() {
  const { permissions, setPermissions } = useContext(AuthContext);
  return [permissions, setPermissions];
}
