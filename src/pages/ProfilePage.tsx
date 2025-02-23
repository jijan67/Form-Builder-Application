import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse } from '../types';

type Order = 'asc' | 'desc';
type TemplateOrderBy = 'title' | 'createdAt' | 'responses' | 'likes';
type ResponseOrderBy = 'templateTitle' | 'createdAt';

const ProfilePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [templateOrder, setTemplateOrder] = useState<Order>('desc');
  const [templateOrderBy, setTemplateOrderBy] = useState<TemplateOrderBy>('createdAt');
  const [responseOrder, setResponseOrder] = useState<Order>('desc');
  const [responseOrderBy, setResponseOrderBy] = useState<ResponseOrderBy>('createdAt');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [templatesRes, responsesRes] = await Promise.all([
        fetch('/api/templates/my'),
        fetch('/api/forms/my-responses'),
      ]);

      const [templatesData, responsesData] = await Promise.all([
        templatesRes.json(),
        responsesRes.json(),
      ]);

      setTemplates(templatesData);
      setResponses(responsesData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleTemplateSort = (property: TemplateOrderBy) => {
    const isAsc = templateOrderBy === property && templateOrder === 'asc';
    setTemplateOrder(isAsc ? 'desc' : 'asc');
    setTemplateOrderBy(property);
  };

  const handleResponseSort = (property: ResponseOrderBy) => {
    const isAsc = responseOrderBy === property && responseOrder === 'asc';
    setResponseOrder(isAsc ? 'desc' : 'asc');
    setResponseOrderBy(property);
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    const multiplier = templateOrder === 'asc' ? 1 : -1;
    switch (templateOrderBy) {
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'responses':
        return multiplier * (a.responses.length - b.responses.length);
      case 'likes':
        return multiplier * (a.likedBy.length - b.likedBy.length);
      default:
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  const sortedResponses = [...responses].sort((a, b) => {
    const multiplier = responseOrder === 'asc' ? 1 : -1;
    switch (responseOrderBy) {
      case 'templateTitle':
        return multiplier * a.template.title.localeCompare(b.template.title);
      default:
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label={t('profile.myTemplates')} />
          <Tab label={t('profile.myResponses')} />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/templates/create')}
              sx={{ mb: 2 }}
            >
              {t('template.create')}
            </Button>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={templateOrderBy === 'title'}
                        direction={templateOrder}
                        onClick={() => handleTemplateSort('title')}
                      >
                        {t('template.title')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={templateOrderBy === 'createdAt'}
                        direction={templateOrder}
                        onClick={() => handleTemplateSort('createdAt')}
                      >
                        {t('common.created')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={templateOrderBy === 'responses'}
                        direction={templateOrder}
                        onClick={() => handleTemplateSort('responses')}
                      >
                        {t('template.responses')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={templateOrderBy === 'likes'}
                        direction={templateOrder}
                        onClick={() => handleTemplateSort('likes')}
                      >
                        {t('template.likes')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.title}</TableCell>
                      <TableCell>
                        {new Date(template.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{template.responses.length}</TableCell>
                      <TableCell>{template.likedBy.length}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => navigate(`/template/${template.id}`)}>
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/template/${template.id}/edit`)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Responses Tab */}
        {/* ... Similar structure for responses table ... */}
      </Paper>
    </Container>
  );
};

export default ProfilePage; 