import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, registerRequest } from '../api/auth';
import { getProfile } from '../api/users';
import { AUTH_STORAGE_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile to get ID after login
  const fetchUserProfile = async (authToken) => {
    try {
      const { data } = await getProfile();
      return {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'user',
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };
  // عند إعادة فتح التطبيق، يبقى مسجّلاً 
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const { user: storedUser, token: storedToken } = JSON.parse(stored);
        setUser(storedUser ?? null);
        setToken(storedToken ?? null);
        // Fetch full profile if we have token but no user ID
        if (storedToken && storedUser && !storedUser.id) {
          fetchUserProfile(storedToken).then((profile) => {
            if (profile) {
              const updatedUser = { ...storedUser, ...profile };
              setUser(updatedUser);
              persistAuth({ user: updatedUser, token: storedToken });
            }
          });
        }
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setInitializing(false);
  }, []);

  const persistAuth = (data) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  };

  const handleLogin = async (credentials) => {
    const { data } = await loginRequest(credentials);
    const token = data.access_token;
    
    // Fetch full user profile including ID
    const userProfile = await fetchUserProfile(token);
    
    const authPayload = {
      token,
      user: userProfile || {
        email: credentials.email,
        role: data.role || 'user',
      },
    };
    setUser(authPayload.user);
    setToken(authPayload.token);
    persistAuth(authPayload);
    return authPayload;
  };

  const handleRegister = async (payload) => {
    const { data } = await registerRequest(payload);
    
    // تسجيل الدخول تلقائياً بعد التسجيل
    if (payload.email && payload.password) {
      try {
        await handleLogin({
          email: payload.email,
          password: payload.password,
        });
      } catch (loginError) {
        console.error('Auto-login after registration failed:', loginError);
        // نعيد البيانات حتى لو فشل تسجيل الدخول التلقائي
      }
    }
    
    return data;
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    persistAuth({ user: updatedUser, token });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token),
      login: handleLogin,
      register: handleRegister,
      logout,
      updateUser,
    }),
    [user, token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
