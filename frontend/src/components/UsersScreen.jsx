
// import { useState, useEffect } from 'react';
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
import { People as PeopleIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const UsersScreen = () => {

	return (
		<>
			<Typography variant="h4" component="h1" gutterBottom>
				<PeopleIcon /> Users Screen
			</Typography>
		</>
	);
};

export default UsersScreen;