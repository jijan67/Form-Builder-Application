import { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TableSortLabel,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse } from '../types';
import { mockApi } from '../mocks/data';

type SortField = 'title' | 'createdAt' | 'responses';
type SortOrder = 'asc' | 'desc';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'responses':
        return multiplier * (a.responses.length - b.responses.length);
      default:
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  const handleCreateTemplate = () => {
    navigate('/template/new');
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/template/edit/${templateId}`);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm(t('template.confirmDelete'))) {
      await mockApi.templates.delete(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label={t('profile.myTemplates')} />
          <Tab label={t('profile.myResponses')} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTemplate}
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
                          active={sortField === 'title'}
                          direction={sortOrder}
                          onClick={() => handleSort('title')}
                        >
                          {t('template.title')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'createdAt'}
                          direction={sortOrder}
                          onClick={() => handleSort('createdAt')}
                        >
                          {t('template.created')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'responses'}
                          direction={sortOrder}
                          onClick={() => handleSort('responses')}
                        >
                          {t('template.responses')}
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>{t('template.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTemplates.map((template) => (
                      <TableRow
                        key={template.id}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/template/${template.id}`)}
                      >
                        <TableCell>{template.title}</TableCell>
                        <TableCell>
                          {new Date(template.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{template.responses.length}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTemplate(template.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('response.template')}</TableCell>
                    <TableCell>{t('response.submitted')}</TableCell>
                    <TableCell>{t('response.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow
                      key={response.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/response/${response.id}`)}
                    >
                      <TableCell>{response.template.title}</TableCell>
                      <TableCell>
                        {new Date(response.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit response
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete response
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile; 