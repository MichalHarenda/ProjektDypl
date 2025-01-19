import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../apiService';

function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await registerUser(form);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">{'Register'}</button>
            </form>
            <button onClick={() => navigate('/')}>Go back</button>
        </div>
    );
}

export default Register;

