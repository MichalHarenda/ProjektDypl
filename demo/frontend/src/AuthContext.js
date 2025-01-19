import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from "./apiService";
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user object including token and roles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);  // Decode the token to extract user information
                    setUser({ token, roles: decoded.roles }); // Store roles along with token
                } catch (err) {
                    setError('Authentication failed!');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        setError(null);
        try {
            const { jwt } = await loginUser(credentials);
            localStorage.setItem('jwtToken', jwt);
            const decoded = jwtDecode(jwt); // Decode the token after login
            setUser({ token: jwt, roles: decoded.roles }); // Store roles along with token
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed.');
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    const value = { user, login, logout, loading, error };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;