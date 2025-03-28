// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      setIsAuthenticated(value === 'true');
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);