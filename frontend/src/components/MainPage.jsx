import { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import AppHeader from './AppHeader';
import AppDrawer from './AppDrawer';
// import UserManagement from './UserManagement';

const MainPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppHeader onDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
      
      <Box sx={{ display: 'flex', flexGrow: 1, backgroundColor:'rgb(216, 216, 216)'}}>
        <AppDrawer 
          open={mobileOpen} 
          onClose={handleDrawerToggle} 
          isMobile={isMobile} 
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            marginLeft: { sm: '240px' },
          }}
        >
          
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;