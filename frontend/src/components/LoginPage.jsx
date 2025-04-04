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
	useMediaQuery,
	InputAdornment,
	IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { login } = useAuth();
	const navigate = useNavigate();

	// Toggle password visibility
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(false);

		const payload = {
			email: email.trim(),
			password: password.trim(),
		};

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				setError(true);
				throw new Error('Invalid username or password');
			}

			const data = await response.json();
			login(data.user, data.token);
			navigate('/main');

		} catch (error) {
			console.error(error);
			setError(true);
		}
	};

	return (
		<Container
			maxWidth="xs"
			sx={{
				minWidth: '100vw',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'rgb(216, 216, 216)'
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

					{error && (
						<Typography color="error" align="center">
							Invalid username or password
						</Typography>
					)}

					<TextField
						label="Email"
						variant="outlined"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						fullWidth
						error={error}
						sx={{
							'& .MuiOutlinedInput-root': {
								backgroundColor: 'white',
								'&.Mui-focused fieldset': {
									borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
								},
							},
						}}
						InputLabelProps={{
							sx: {
								color: error ? 'error.main' : 'text.secondary',
								'&.Mui-focused': {
									color: error ? theme.palette.error.main : theme.palette.primary.main,
								},
							},
						}}
					/>

					<TextField
						label="Password"
						type={showPassword ? 'text' : 'password'} // Toggle between text and password
						variant="outlined"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						fullWidth
						error={error}
						InputProps={{ // Add eye icon toggle
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								backgroundColor: 'white',
								'&.Mui-focused fieldset': {
									borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
								},
							},
							mt: 2,
						}}
						InputLabelProps={{
							sx: {
								color: error ? 'error.main' : 'text.secondary',
								'&.Mui-focused': {
									color: error ? theme.palette.error.main : theme.palette.primary.main,
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