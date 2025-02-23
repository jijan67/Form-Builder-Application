import { AppBar, Toolbar, Typography, Button, IconButton, TextField, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { mode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/templates?search=${searchQuery}`);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Forms App
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <form onSubmit={handleSearch} style={{ flexGrow: 1, margin: '0 2rem' }}>
          <TextField 
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
        </form>

        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        
        <Button color="inherit" onClick={() => navigate('/templates')}>
          Templates
        </Button>
        {user && (
          <>
            <Button color="inherit" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            {user.isAdmin && (
              <Button color="inherit" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
        {!user && (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 