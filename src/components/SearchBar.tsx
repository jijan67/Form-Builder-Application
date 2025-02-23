import { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Template } from '../types';
import { debounce } from 'lodash';

const SearchBar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchTemplates = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchTemplates, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      getOptionLabel={(option) => option.title}
      onChange={(_, value) => {
        if (value) {
          navigate(`/template/${value.id}`);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('search.placeholder')}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Paper sx={{ p: 1, width: '100%' }}>
            <Typography variant="subtitle1">{option.title}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {option.description}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {option.tags.map((tag) => (
                <Typography
                  key={tag}
                  component="span"
                  variant="caption"
                  sx={{
                    mr: 0.5,
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    padding: '2px 6px',
                    borderRadius: 1,
                  }}
                >
                  {tag}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    />
  );
};

export default SearchBar; 