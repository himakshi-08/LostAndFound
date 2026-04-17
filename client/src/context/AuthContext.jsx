import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const signup = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/auth/signup', userData);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const updateProfile = async (profileData) => {
        const res = await axios.put('http://localhost:5000/api/auth/profile', profileData);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
