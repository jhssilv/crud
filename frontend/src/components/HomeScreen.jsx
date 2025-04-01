
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
import { Home as HomeIcon } from '@mui/icons-material';
  
const HomeScreen = () => {
  
    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                <HomeIcon /> Home Screen
            </Typography>
        </>
    );
};
  
export default HomeScreen;