import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

const AppHeader = ({ onDrawerToggle, isMobile }) => {
  return (
    <AppBar position="static" sx={{ width: '100vw' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <DashboardIcon />
        <Typography variant="h6" noWrap component="div" marginLeft={'5px'}>
          App Header
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;