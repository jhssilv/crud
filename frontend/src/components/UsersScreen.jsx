import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  TablePagination,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserFormDialog from './UserFormDialog';
import UsersTable from './UsersTable';
import { useAuth } from './functions/useAuth.jsx';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 20
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const {isAdmin, token, username} = useAuth();

  const fetchUsers = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/users?page=${page + 1}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or missing token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setUsers(data.data.users);
      setPagination({
        page,
        totalPages: data.data.pagination.total_pages,
        totalUsers: data.data.pagination.total_users,
        usersPerPage: 20
      });
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
      // Redirect to login if token is invalid
      if (err.message.includes('Unauthorized')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleCreateUser = async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    fetchUsers(pagination.page);
  };

  const handleEditUser = async (userData) => {
    try {
      const response = await fetch(`/api/users/${userData}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to edit user');
      }

      fetchUsers(pagination.page);
    } catch (err) {
      console.error('Edit error:', err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the user list
      fetchUsers(pagination.page);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const handlePageChange = (event, newPage) => {
    fetchUsers(newPage);
  };

  const handleNewUser = () => {
    setIsDialogOpen(true);
  };

  if (loading && users.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => fetchUsers(pagination.page)} variant="outlined">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Hello, {username}!
        </Typography>

        {isAdmin && (isSmallScreen ? (
          <Tooltip title="Add new user">
            <IconButton 
              color="primary" 
              onClick={handleNewUser} 
              size="large"
              disabled={!isAdmin}
            >
              <PersonAddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewUser}
            size={isMediumScreen ? "medium" : "large"}
            disabled={!isAdmin}
          >
            New User
          </Button>
        ))}
      </Stack>

      <UsersTable
        users={users}
        isAdmin={isAdmin}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />

      <TablePagination
        component="div"
        count={pagination.totalUsers}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.usersPerPage}
        rowsPerPageOptions={[20]}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 2
        }}
      />

      {loading && users.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <UserFormDialog
        open={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSubmit={handleCreateUser}
      />
    </Container>
  );
};

export default UsersScreen;