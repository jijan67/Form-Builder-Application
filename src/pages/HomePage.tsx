import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, Tag } from '../types';
import { mockApi } from '../mocks/data';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [latestTemplates, setLatestTemplates] = useState<Template[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get latest templates
      const templates = await mockApi.templates.getAll();
      const sorted = [...templates].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestTemplates(sorted.slice(0, 6));

      // Get popular templates
      const popular = [...templates].sort((a, b) => 
        b.responses.length - a.responses.length
      );
      setPopularTemplates(popular.slice(0, 5));

      // Get tags
      const allTags = await mockApi.tags.getAll();
      setTags(allTags);
    };

    fetchData();
  }, []);

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Latest Templates Gallery */}
      <Typography variant="h4" gutterBottom>
        {t('home.latestTemplates')}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {latestTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              sx={{ height: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/template/${template.id}`)}
            >
              {template.imageUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={template.imageUrl}
                  alt={template.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {template.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {t('template.by')} {template.author.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popular Templates Table */}
      <Typography variant="h4" gutterBottom>
        {t('home.popularTemplates')}
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('template.title')}</TableCell>
              <TableCell>{t('template.author')}</TableCell>
              <TableCell align="right">{t('template.responses')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {popularTemplates.map((template) => (
              <TableRow
                key={template.id}
                hover
                onClick={() => navigate(`/template/${template.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{template.title}</TableCell>
                <TableCell>{template.author.name}</TableCell>
                <TableCell align="right">{template.responses.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tag Cloud */}
      <Typography variant="h4" gutterBottom>
        {t('home.popularTags')}
      </Typography>
      <Box sx={{ mb: 4 }}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={`${tag.name} (${tag.count})`}
            onClick={() => handleTagClick(tag.name)}
            sx={{ 
              m: 0.5, 
              fontSize: `${Math.min(16 + tag.count * 0.5, 24)}px`
            }}
          />
        ))}
      </Box>
    </Container>
  );
};

export default HomePage; 