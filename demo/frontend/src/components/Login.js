import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './../AuthContext';

function Login() {
    const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, error: authError } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        await login(form);
        if (!authError) {
            navigate('/campaign', { replace: true });
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {authError && <div style={{ color: 'red' }}>{"Login failed"}</div>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="usernameOrEmail" onChange={handleChange} placeholder="Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">{'Login'}</button>
            </form>
            <p>
                Don't have an account? <button onClick={() => navigate('/register')}>Register here</button>
            </p>
        </div>
    );
}

export default Login;
