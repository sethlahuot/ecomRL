import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import Sidebar from '../../components/common/Sidebar';
import { apiUrl, adminToken } from '../../components/common/http';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import Nostate from '../../components/common/Nostate';
import ChangeUserPassword from '../../components/admin/ChangeUserPassword';
import CreateUser from '../../components/admin/CreateUser';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [changingPasswordFor, setChangingPasswordFor] = useState(null);
    const [showCreateUser, setShowCreateUser] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();
            if (result.status === 200) {
                setUsers(result.data);
            } else {
                toast.error(result.message || 'Failed to fetch users');
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${apiUrl}/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });
                const result = await response.json();
                if (result.status === 200) {
                    toast.success(result.message || 'User deleted successfully');
                    fetchUsers();
                } else {
                    toast.error(result.message || 'Failed to delete user');
                }
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${apiUrl}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const result = await response.json();
            if (result.status === 200) {
                toast.success(result.message || 'User role updated successfully');
                fetchUsers();
            } else {
                toast.error(result.message || 'Failed to update user role');
            }
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setEditForm({ name: user.name, email: user.email });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(editForm)
            });
            const result = await response.json();
            if (result.status === 200) {
                toast.success(result.message || 'User updated successfully');
                setEditingUser(null);
                fetchUsers();
            } else {
                if (result.errors) {
                    // Display validation errors
                    Object.values(result.errors).forEach(error => {
                        toast.error(error[0]);
                    });
                } else {
                    toast.error(result.message || 'Failed to update user');
                }
            }
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: '', email: '' });
    };

    return (
        <Layout>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Users Management</h2>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateUser(true)}
                    >
                        Create User
                    </button>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar/>
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                {loading ? (
                                    <Loader />
                                ) : users.length === 0 ? (
                                    <Nostate text="No users found" />
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Joined Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            {editingUser === user.id ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    name="name"
                                                                    value={editForm.name}
                                                                    onChange={handleEditChange}
                                                                />
                                                            ) : (
                                                                user.name
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingUser === user.id ? (
                                                                <input
                                                                    type="email"
                                                                    className="form-control form-control-sm"
                                                                    name="email"
                                                                    value={editForm.email}
                                                                    onChange={handleEditChange}
                                                                />
                                                            ) : (
                                                                user.email
                                                            )}
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={user.role}
                                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </td>
                                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="btn-group">
                                                                {editingUser === user.id ? (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm btn-success me-1"
                                                                            onClick={() => handleEditSubmit(user.id)}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-secondary"
                                                                            onClick={handleCancelEdit}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm btn-primary me-1"
                                                                            onClick={() => handleEditClick(user)}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-warning me-1"
                                                                            onClick={() => setChangingPasswordFor(user.id)}
                                                                        >
                                                                            Change Password
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => handleDeleteUser(user.id)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {changingPasswordFor && (
                <ChangeUserPassword
                    userId={changingPasswordFor}
                    onClose={() => setChangingPasswordFor(null)}
                />
            )}
            {showCreateUser && (
                <CreateUser
                    onClose={() => setShowCreateUser(false)}
                    onUserCreated={fetchUsers}
                />
            )}
        </Layout>
    );
};

export default Users; 