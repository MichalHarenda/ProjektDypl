import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './../AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { makeRequest } from "../apiService";

function UserManagement() {
    const { user, logout } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaignId');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', isAdmin: false });
    const [editingUser, setEditingUser] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [formErrors, setFormErrors] = useState({}); // New state for form errors
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages



    const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN');
    const isUser = user && Array.isArray(user.roles) && user.roles.includes('ROLE_USER');
    const validateUser = (user) => {
        const errors = {};

        // Check if username already exists
        const userExists = users.find(u =>
            u.username.toLowerCase() === user.username.toLowerCase() && u.id !== editingUser?.id
        );
        if (userExists) {
            errors.username = "A user with that username already exists.";
        }

        // Check if email already exists
        // Check if email already exists
        const emailExists = users.find(u =>
            u.email.toLowerCase() === user.email.toLowerCase() && u.id !== editingUser?.id
        );        if (emailExists) {
            errors.email = "A user with that email already exists.";
        }

        return errors;
    };

    useEffect(() => {
        const fetchCurrentUserId = async () => {
            try {
                const id = await makeRequest('/api/users/current/id', 'GET', null, user.token);
                setCurrentUserId(id);
            } catch (error) {
                console.error('Error fetching current user ID:', error);
            }
        };

        fetchCurrentUserId();
    }, [user]); // We only need to fetch the current user ID when the user changes

    // Conditional fetching based on isAdmin
    useEffect(() => {
        const fetchUsers = async () => {
            if (isAdmin) {
                try {
                    const data = await makeRequest('/api/users', 'GET', null, user.token);
                    // Exclude the current user from the users list
                    const filteredUsers = data.filter(u => u.id !== currentUserId);
                    setUsers(filteredUsers);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                // If not admin, fetch only the current user details
                if (currentUserId) {
                    try {
                        const userData = await makeRequest(`/api/users/current/summary`, 'GET', null, user.token);
                        setUsers([{ id: currentUserId, ...userData }]); // Set the user data with currentUserId
                    } catch (error) {
                        console.error('Error fetching user:', error);
                    }
                }
            }
        };

        fetchUsers();
    }, [currentUserId, user.token, isAdmin]); // Dependency array includes isAdmin

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const clearError = (fieldName, value) => {
        if (fieldName === 'name' && value.length > 0) {
            const newErrors = { ...formErrors };
            delete newErrors.name;
            setFormErrors(newErrors);
        }
    };
    const handleInput = (e) => {
        const { name, value } = e.target;
        // Update the newUser state or the editingUser state based on the form context
        if (editingUser) {
            setEditingUser(oldEditingUser => ({
                ...oldEditingUser,
                [name]: value
            }));
            clearError(name, value);
        } else {
            setNewUser(oldNewUser => ({
                ...oldNewUser,
                [name]: value
            }));
        }
        setFormErrors({}); // Reset errors when typing
    };
    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormErrors({}); // Reset form errors

        // Validate new user data
        const errors = validateUser(newUser);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // Set errors for validation
            return; // Prevent submission if errors exist
        }

        try {
            const addedUser = await makeRequest('/api/register', 'POST', newUser, user.token);
            setUsers([...users, addedUser]);
            setNewUser({ username: '', email: '', password: '', isAdmin: false });
            setShowAddUserForm(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async (userId, e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setErrorMessage(''); // Reset error message before trying to update
        setFormErrors({}); // Reset form errors

        // Validate editing user data
        const errors = validateUser(editingUser);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // Set errors for validation
            return; // Prevent submission if errors exist
        }


            try {
            const updatedUser = await makeRequest(`/api/users/${userId}`, 'PUT', editingUser, user.token);
            setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
            setEditingUser(null);
                if (isUser) {
                    logout(); // Log the user out if they are a user
                    alert("Profile successfully changed. Please log in again."); // Display message
                }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data); // Assuming the backend returns an error message in the response data
            } else {
                setErrorMessage('Wrong username or email.'); // Generic error message
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await makeRequest(`/api/users/${userId}`, 'DELETE', null, user.token);
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (

        <div>


            <p>Wilkommen!</p>
            <button onClick={() => navigate('/dashboard?campaignId=' + campaignId)}>Dashboard</button>
            <button onClick={() => navigate('/items?campaignId=' + campaignId)}>Items</button>
            <button onClick={() => navigate('/bestiary?campaignId=' + campaignId)}>Bestiary</button>
            <button onClick={logout}>Logout</button><br/><br/>
            {isAdmin && (
                <button onClick={() => setShowAddUserForm(true)}>Add user</button>
            )}

            {isAdmin && showAddUserForm && (
                <form onSubmit={handleAddUser}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={handleInput}
                        required
                    />
                    {formErrors.username && <span className="error-message">{formErrors.username}</span>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleInput}
                        required
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={handleInput}
                        required
                    />
                    <button type="submit">Add User</button>
                    <button type="button" onClick={() => setShowAddUserForm(false)}>Cancel</button>
                </form>
            )}
            {isAdmin && (
                <>
            <h2>Search User</h2>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
                </>
            )}
            <h2>Your information: </h2>
            <p>Your ID: {currentUserId}</p>
            <table>
                <thead>
                <tr>
                    {isAdmin && (
                    <th>Id</th>
                    )}
                    <th>Username</th>
                    <th>Email</th>
                    {isAdmin && (
                    <th>IsAdmin</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                        {isAdmin && (
                        <td>{user.id}</td>
                        )}
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        {isAdmin && (
                        <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                        )}
                        <td>
                            <button onClick={() => setEditingUser(user)}>Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            {editingUser && (
                <form onSubmit={(e) => handleUpdateUser(editingUser.id, e)}>
                    <h2>Edit User</h2>
                    <input
                        type="text"
                        name="username"
                        value={editingUser.username}
                        onChange={handleInput}
                        required
                    />
                    {formErrors.username && <span className="error-message">{formErrors.username}</span>}

                    <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={handleInput}
                        required
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}

                    {isAdmin && (
                        <label>
                            Is Admin?
                            <input
                                type="checkbox"
                                checked={editingUser.isAdmin}
                                onChange={(e) => setEditingUser({...editingUser, isAdmin: e.target.checked})}
                            />
                        </label>
                    )}
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                </form>
            )}
            {/* Display the error message, if any */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default UserManagement;