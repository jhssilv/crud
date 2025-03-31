import { useState } from 'react';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Home as HomeIcon, People as PeopleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from './functions/useAuth';
import { useNavigate } from 'react-router-dom';

const AppDrawer = ({ open, onClose, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    if (isMobile) onClose();
    setOpenDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setOpenDialog(false);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, action: () => navigate('/main') },
    { text: 'Users', icon: <PeopleIcon />, action: () => navigate('/main') },
    { text: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            height: 'calc(100vh - 64px)',
            top: 'auto',
            position: 'fixed'
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={item.action}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppDrawer;