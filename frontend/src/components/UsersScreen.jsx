import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Button,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
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

const UsersScreen = () => {
	const [users, setUsers] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		page: 0, // MUI pagination starts at 0
		totalPages: 1,
		totalUsers: 0,
		usersPerPage: 20
	});

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
	const username = localStorage.getItem('loggedUser') || 'Guest';

	const fetchUsers = async (page = 0) => {
		try {
			setLoading(true);
			const response = await fetch(`/api/users?page=${page + 1}`);

			if (!response.ok) {
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
		} finally {
			setLoading(false);
		}
	};

	const handleCreateUser = async (userData) => {
		const response = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to create user');
		}

		// Refresh the user list
		fetchUsers(pagination.page);
	};

	useEffect(() => {
		fetchUsers(0);
	}, []);

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
			{/* Header with responsive new user button */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1">
					Hello, {username}!
				</Typography>

				{isSmallScreen ? (
					<Tooltip title="Add new user">
						<IconButton color="primary" onClick={handleNewUser} size="large">
							<PersonAddIcon fontSize="large" />
						</IconButton>
					</Tooltip>
				) : (
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={handleNewUser}
						size={isMediumScreen ? "medium" : "large"}
					>
						New User
					</Button>
				)}
			</Stack>

			{/* Table with responsive layout */}
			<Paper elevation={3} sx={{ overflow: 'hidden' }}>
				<TableContainer>
					<Table aria-label="users table">
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								{!isSmallScreen && <TableCell>Name</TableCell>}
								<TableCell>Email</TableCell>
								{!isSmallScreen && <TableCell>Role</TableCell>}
								{isSmallScreen && <TableCell align="right">Details</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow
									key={user.id}
									hover
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{user.id}
									</TableCell>
									{!isSmallScreen && <TableCell>{user.name}</TableCell>}
									<TableCell>
										{isSmallScreen ? (
											<Box>
												<Typography variant="body2" fontWeight="bold">
													{user.name}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{user.email}
												</Typography>
											</Box>
										) : (
											user.email
										)}
									</TableCell>
									{!isSmallScreen && (
										<TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
									)}
									{isSmallScreen && (
										<TableCell align="right">
											<Button size="small" variant="outlined">
												View
											</Button>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Pagination controls */}
				<TablePagination
					component="div"
					count={pagination.totalUsers}
					page={pagination.page}
					onPageChange={handlePageChange}
					rowsPerPage={pagination.usersPerPage}
					rowsPerPageOptions={[20]} // Fixed to match API
					sx={{
						borderTop: '1px solid',
						borderColor: 'divider'
					}}
				/>
			</Paper>

			{/* Loading indicator for page transitions */}
			{loading && users.length > 0 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
					<CircularProgress size={24} />
				</Box>
			)}

			<UserFormDialog
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onSubmit={handleCreateUser}
			/>
		</Container>
	);
};

export default UsersScreen;