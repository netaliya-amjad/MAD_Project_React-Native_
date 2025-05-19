
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './AuthContext';


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // store user object
  const [token, setToken] = useState(null);   // store JWT token
  const [loading, setLoading] = useState(true); // for app splash/loading state

  // App start pe AsyncStorage se token aur user data fetch karen
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error loading auth data', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Login function jo AsyncStorage aur state dono update karega
  const login = async (token, userData) => {
    setToken(token);
    setUser(userData);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function jo state clear karega aur AsyncStorage se data hataega
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
