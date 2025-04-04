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
  Typography
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
    <Paper elevation={3} sx={{ 
      overflow: 'hidden',
      mx: isSmallScreen ? -2 : 0,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 200px)',
      height: '100%'
    }}>
      <TableContainer 
        sx={{ 
          overflow: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': { 
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb': { 
            backgroundColor: theme.palette.grey[400],
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[100]
          }
        }}
      >
        <Table 
          aria-label="users table"
          size={isSmallScreen ? 'small' : 'medium'}
          stickyHeader
          sx={{ 
            minWidth: 'max-content',
            '& .MuiTableCell-root': {
              px: isSmallScreen ? 1 : 2,
              py: isSmallScreen ? 0.5 : 1.5,
              whiteSpace: 'nowrap'
            },
            '& .MuiTableCell-head': {
              backgroundColor: theme.palette.background.paper
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
              {!isSmallScreen && <TableCell sx={{ minWidth: 120 }}>Name</TableCell>}
              <TableCell sx={{ minWidth: isSmallScreen ? 150 : 200 }}>Email</TableCell>
              {!isSmallScreen && <TableCell sx={{ minWidth: 80 }}>Role</TableCell>}
              <TableCell align="right" sx={{ 
                minWidth: isSmallScreen ? 100 : 120,
                pr: isSmallScreen ? 1 : 2,
                position: 'sticky',
                right: 0,
                backgroundColor: theme.palette.background.paper
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  {user.id}
                </TableCell>
                {!isSmallScreen && <TableCell>{user.name}</TableCell>}
                <TableCell>
                  {isSmallScreen ? (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                      {isSmallScreen && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {user.is_admin ? 'Admin' : 'User'}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    user.email
                  )}
                </TableCell>
                {!isSmallScreen && (
                  <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                )}
                <TableCell align="right" sx={{
                  position: 'sticky',
                  right: 0,
                  backgroundColor: theme.palette.background.paper
                }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      gap: 0.5,
                      justifyContent: 'flex-end',
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => onEdit(user)}
                        disabled={!isAdmin}
                        color="primary"
                        size={isSmallScreen ? 'small' : 'medium'}
                        sx={{ 
                          p: 0.75,
                          '& svg': { 
                            fontSize: isSmallScreen ? '1.25rem' : '1.5rem' 
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => onDelete(user.id)}
                        disabled={!isAdmin}
                        color="error"
                        size={isSmallScreen ? 'small' : 'medium'}
                        sx={{ 
                          p: 0.75,
                          '& svg': { 
                            fontSize: isSmallScreen ? '1.25rem' : '1.5rem' 
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
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