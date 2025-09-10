import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role, exp, token }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      // if expired, clear it
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }
      setUser({ ...decoded, token });
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser({ ...decoded, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
