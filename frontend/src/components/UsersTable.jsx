import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme, useMediaQuery } from '@mui/material';

const UsersTable = ({ 
  users, 
  isAdmin, 
  onEdit, 
  onDelete
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <TableContainer>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {!isSmallScreen && <TableCell>Name</TableCell>}
              <TableCell>Email</TableCell>
              {!isSmallScreen && <TableCell>Role</TableCell>}
              <TableCell align="right">Actions</TableCell>
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
                <TableCell align="right">
                  {isSmallScreen ? (
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <span>
                          <IconButton 
                            onClick={() => onEdit(user)}
                            disabled={!isAdmin}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton 
                            onClick={() => onDelete(user.id)}
                            disabled={!isAdmin}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UsersTable;