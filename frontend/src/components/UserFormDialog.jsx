import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';

const UserFormDialog = ({ 
  open, 
  setIsDialogOpen, 
  handleCreateUser,
  handleEditUser,
  userData
}) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    is_admin: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Reset form when userData changes
  useEffect(() => {
    if (userData) {
      // Edit mode - populate fields except password
      setFormData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: '', // Don't show existing password
        is_admin: userData.is_admin
      });
    } else {
      // Create mode - reset form
      setFormData({
        id: null,
        name: '',
        email: '',
        password: '',
        is_admin: false
      });
    }
    setErrors({});
    setSubmitError('');
  }, [userData, open]); // Reset when userData or open changes

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    // Only validate password for new users
    if (!formData.id && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!formData.id && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      if (formData.id) {
        await handleEditUser(formData);
      } else {
        await handleCreateUser(formData);
      }
      setIsDialogOpen(false); // Close on success
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit user');
    }
  };

  const onClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{formData.id ? 'Edit User' : 'Create New User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          
          <FormControlLabel
            control={
              <Checkbox
                name="is_admin"
                checked={formData.is_admin}
                onChange={handleChange}
              />
            }
            label="Administrator"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;