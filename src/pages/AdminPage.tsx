import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { User } from '../types';
import { mockApi } from '../mocks/data';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await mockApi.users.getAll();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId: string) => {
    // Don't allow admin to remove their own admin rights if they're the last admin
    if (userId === currentUser?.id) {
      const adminCount = users.filter(u => u.isAdmin).length;
      if (adminCount <= 1) {
        alert(t('admin.lastAdmin'));
        return;
      }
    }

    await mockApi.users.toggleAdmin(userId);
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u
    ));
  };

  const handleToggleBlock = async (userId: string) => {
    // Don't allow blocking the last admin
    if (users.find(u => u.id === userId)?.isAdmin) {
      const adminCount = users.filter(u => u.isAdmin).length;
      if (adminCount <= 1) {
        alert(t('admin.cantBlockLastAdmin'));
        return;
      }
    }

    await mockApi.users.toggleBlock(userId);
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    ));
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    // Don't allow deleting the last admin
    if (selectedUser.isAdmin) {
      const adminCount = users.filter(u => u.isAdmin).length;
      if (adminCount <= 1) {
        alert(t('admin.cantDeleteLastAdmin'));
        return;
      }
    }

    await mockApi.users.delete(selectedUser.id);
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('admin.userManagement')}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.name')}</TableCell>
              <TableCell>{t('admin.email')}</TableCell>
              <TableCell align="center">{t('admin.isAdmin')}</TableCell>
              <TableCell align="center">{t('admin.isBlocked')}</TableCell>
              <TableCell align="center">{t('admin.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.isAdmin}
                    onChange={() => handleToggleAdmin(user.id)}
                    disabled={user.isBlocked}
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.isBlocked}
                    onChange={() => handleToggleBlock(user.id)}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('admin.confirmDelete')}</DialogTitle>
        <DialogContent>
          {t('admin.deleteWarning', { name: selectedUser?.name })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage; 