import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { Template } from '../types';
import { mockApi } from '../mocks/data';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [results, setResults] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag');

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      try {
        let searchResults;
        if (tag) {
          searchResults = await mockApi.templates.searchByTag(tag);
        } else {
          searchResults = await mockApi.templates.search(query);
        }
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query, tag]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {tag ? (
          <>
            {t('search.resultsForTag')} <Chip label={tag} />
          </>
        ) : (
          <>
            {t('search.resultsFor')} "{query}"
          </>
        )}
      </Typography>

      <Paper>
        <List>
          {results.length === 0 ? (
            <ListItem>
              <ListItemText primary={t('search.noResults')} />
            </ListItem>
          ) : (
            results.map((template, index) => (
              <Box key={template.id}>
                {index > 0 && <Divider />}
                <ListItem
                  button
                  onClick={() => navigate(`/template/${template.id}`)}
                >
                  <ListItemText
                    primary={template.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {template.author.name} - 
                        </Typography>
                        {" " + template.description}
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default SearchResults; 