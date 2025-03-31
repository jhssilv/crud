import { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  IconButton,
  TextField
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { query } from '../database/config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await query('SELECT id, name, email, is_admin FROM users WHERE deleted_at IS NULL');
        setUsers(result.rows);
        
        // Check if current user is admin (you'll need to implement this)
        const currentUser = 'admin';
        setIsAdmin(currentUser.is_admin);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleSave = async (id) => {
    try {
      await query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [editData.name, editData.email, id]
      );
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...editData } : user
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await query(
        'UPDATE users SET deleted_at = NOW() WHERE id = $1',
        [id]
      );
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <TextField
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      size="small"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <TextField
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      size="small"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                {isAdmin && (
                  <TableCell>
                    {editingId === user.id ? (
                      <>
                        <IconButton onClick={() => handleSave(user.id)}>
                          <SaveIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => setEditingId(null)}>
                          <CancelIcon color="error" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(user)}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(user.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserManagement;