import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/admin/users');
      // setUsers(await response.json());
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleToggleAdmin = (userId: string, isAdmin: boolean) => {
    if (userId === currentUser?.id && !isAdmin) {
      setConfirmDialog({
        open: true,
        title: 'Remove Admin Access',
        message: 'Are you sure you want to remove your own admin access? You won\'t be able to access this page anymore.',
        onConfirm: () => confirmToggleAdmin(userId, isAdmin),
      });
    } else {
      confirmToggleAdmin(userId, isAdmin);
    }
  };

  const confirmToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/admin/users/${userId}/toggle-admin`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isAdmin: !isAdmin }),
      // });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: !isAdmin } : u
      ));
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/admin/users/${userId}/toggle-block`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isBlocked: !isBlocked }),
      // });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isBlocked: !isBlocked } : u
      ));
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      onConfirm: () => confirmDeleteUser(userId),
    });
  };

  const confirmDeleteUser = async (userId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/admin/users/${userId}`, {
      //   method: 'DELETE',
      // });
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Blocked</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isAdmin}
                      onChange={() => handleToggleAdmin(user.id, user.isAdmin)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isBlocked}
                      onChange={() => handleToggleBlock(user.id, user.isBlocked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>{confirmDialog.message}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel; 