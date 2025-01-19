import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import CampaignPage from "./components/CampaignPage";
import ItemsPage from "./components/ItemsPage";
import BestiaryPage from "./components/BestiaryPage";
import UserManagement from "./components/UserManagement";
import Profile from "./components/Profile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/campaign" element={<ProtectedRoute><CampaignPage /></ProtectedRoute>} />
                    <Route path="/items" element={<ProtectedRoute><ItemsPage /></ProtectedRoute>} />
                    <Route path="/bestiary" element={<ProtectedRoute><BestiaryPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
