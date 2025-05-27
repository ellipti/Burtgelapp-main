// src/contexts/AuthContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = async (username, password) => {
    console.log('🔐 LOGIN ➤ Хэрэглэгч нэвтрэх гэж байна:', username);
    console.log('🔗 AUTH ➤ Login fetch эхэлж байна...');

    try {
      const response = await fetch('http://192.168.1.92:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // ⬅️ зөвхөн username ашиглана
      });

      const data = await response.json();

      console.log('📥 AUTH ➤ Backend response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Нэвтрэхэд алдаа гарлаа');
      }

      setUser(data);
      setUserType(data.role);
      return data;

    } catch (error) {
      console.error('❌ AUTH ➤ Server fetch алдаа:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
