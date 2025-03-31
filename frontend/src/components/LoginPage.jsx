
import React, { useState } from 'react';
import { useAuth } from './functions/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

import { 
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
        
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Invalid username or password');
        }

        localStorage.setItem('loggedUser', username);
        console.log('Olá ', username);
        login();
        navigate('/main');

    } catch (error) {
        console.error(error);
    }
};

  return (
    <Container 
      maxWidth="xs"
      sx={{
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgb(216, 216, 216)'
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          p: 4,
          border: isMobile ? 'none' : '1px solid #e0e0e0'
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* Header */}
          <Typography 
            variant="h4" 
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            Login Page
          </Typography>

          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            sx={{
                '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                },
                },
            }}
            InputLabelProps={{
                sx: {
                color: 'text.secondary',
                '&.Mui-focused': {
                    color: theme.palette.primary.main,
                },
                },
            }}
            />

            <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{
                '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                },
                },
                mt: 2,
            }}
            InputLabelProps={{
                sx: {
                color: 'text.secondary',
                '&.Mui-focused': {
                    color: theme.palette.primary.main,
                },
                },
            }}
            />

          {/* Submit Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;