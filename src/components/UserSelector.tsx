import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';

interface UserSelectorProps {
  value: User[];
  onChange: (users: User[]) => void;
  disabled?: boolean;
}

type SortField = 'name' | 'email';

const UserSelector = ({ value, onChange, disabled }: UserSelectorProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('name');

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchUsers();
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const sortedUsers = useMemo(() => {
    return [...value].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.email.localeCompare(b.email);
    });
  }, [value, sortBy]);

  const handleRemoveUser = (userId: string) => {
    onChange(value.filter(user => user.id !== userId));
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          multiple
          disabled={disabled}
          options={options}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          value={value}
          onChange={(_, newValue) => onChange(newValue)}
          inputValue={searchTerm}
          onInputChange={(_, newValue) => setSearchTerm(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('template.allowedUsers')}
              placeholder={t('template.searchUsers')}
            />
          )}
          renderTags={() => null}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_, newValue) => newValue && setSortBy(newValue)}
          size="small"
        >
          <ToggleButton value="name">{t('common.sortByName')}</ToggleButton>
          <ToggleButton value="email">{t('common.sortByEmail')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('user.name')}</TableCell>
              <TableCell>{t('user.email')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={disabled}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserSelector; 