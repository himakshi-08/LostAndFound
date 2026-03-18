import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReportItem from './pages/ReportItem';
import Matches from './pages/Matches';
import MyItems from './pages/MyItems';
import Activity from './pages/Activity';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return null;
    return token ? children : <Navigate to="/login" />;
};

const HomeRoute = () => {
    const { token, loading } = useAuth();
    if (loading) return null;
    return token ? <Navigate to="/dashboard" /> : <Home />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-indigo-950 text-lavender font-sans selection:bg-electric-blue/30">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/report-lost" element={<ProtectedRoute><ReportItem type="lost" /></ProtectedRoute>} />
                        <Route path="/report-found" element={<ProtectedRoute><ReportItem type="found" /></ProtectedRoute>} />
                        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
                        <Route path="/my-items" element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
                        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
