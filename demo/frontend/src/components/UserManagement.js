import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './../AuthContext';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {makeRequest} from "../apiService";

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

    useEffect(() => {
        const fetchUsers = async () => {
                try {
                    const data = await makeRequest('/api/users', 'GET', null, user.token);
                    // Exclude the current user from the users list
                    const otherUsers = data.filter(u => u.id !== currentUserId);
                    setUsers(otherUsers);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
        };
        fetchUsers();
    }, [campaignId, user]);
    const filterUsers = (users) =>
        users.filter(user => {
            return user.username.toLowerCase().includes(searchTerm.toLowerCase());
        });

    const filteredUsers = filterUsers(users);


    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const addedUser = await makeRequest('/api/register', 'POST', newUser, user.token);
            setUsers([...users, addedUser]);
            setNewUser({ username: '', email: '', password: '', isAdmin: false });
            setShowAddUserForm(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async (userId) => {
        try {
            const updatedUser = await makeRequest(`/api/users/${userId}`, 'PUT', editingUser, user.token);
            setUsers(users.map(u => (u.id === userId ? updatedUser : u)));
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
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
            <button onClick={logout}>Logout</button>

            <h2>Search user</h2>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h2>Users: </h2>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>IsAdmin</th>
                </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            {/* Show 'Yes' for true, and 'No' for false */}
                            <td>
                                <button onClick={() => setEditingUser(user)}>Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add New User</h2>
            {showAddUserForm ? (
                <form onSubmit={handleAddUser}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <label>
                        Is Admin?
                        <input
                            type="checkbox"
                            checked={newUser.isAdmin}
                            onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                        />
                    </label>
                    <button type="submit">Add User</button>
                    <button type="button" onClick={() => setShowAddUserForm(false)}>Cancel</button>
                </form>
            ) : (
                <button onClick={() => setShowAddUserForm(true)}>Show Add User Form</button>
            )}

            {editingUser && (
                <form onSubmit={() => handleUpdateUser(editingUser.id)}>
                    <h2>Edit User</h2>
                    <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    />
                    <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                    <label>
                        Is Admin?
                        <input
                            type="checkbox"
                            checked={editingUser.isAdmin}
                            onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                        />
                    </label>
                    <button type="submit">Update User</button>
                    <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                </form>
            )}
        </div>


    );
}


export default UserManagement;
