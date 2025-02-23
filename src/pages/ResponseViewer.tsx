import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse, Question } from '../types';

const ResponseViewer = () => {
  const { templateId, responseId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch template and response data
        const [templateRes, responseRes] = await Promise.all([
          fetch(`/api/templates/${templateId}`),
          fetch(`/api/forms/responses/${responseId}`),
        ]);

        if (!templateRes.ok || !responseRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [templateData, responseData] = await Promise.all([
          templateRes.json(),
          responseRes.json(),
        ]);

        setTemplate(templateData);
        setResponse(responseData);
      } catch (error) {
        setError('Error loading response');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId, responseId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!template || !response) return <Alert severity="error">{t('response.notFound')}</Alert>;

  const canEdit = user?.isAdmin || response.user.id === user?.id;

  const getAnswerDisplay = (question: Question, value: any) => {
    switch (question.type) {
      case 'checkbox':
        return value ? t('common.yes') : t('common.no');
      case 'integer':
        return value.toString();
      default:
        return value;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {template.title}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {t('response.submittedBy')}: {response.user.name}
          </Typography>
          <Typography color="text.secondary">
            {t('response.submittedAt')}: {new Date(response.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {template.questions.map((question) => {
            const answer = response.answers.find(a => a.questionId === question.id);
            if (!answer) return null;

            return (
              <Grid item xs={12} key={question.id}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {question.title}
                  </Typography>
                  {question.description && (
                    <Typography color="text.secondary" gutterBottom>
                      {question.description}
                    </Typography>
                  )}
                  <Typography sx={{ mt: 1 }}>
                    {getAnswerDisplay(question, answer.value)}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/template/${templateId}`)}
          >
            {t('common.back')}
          </Button>
          {canEdit && (
            <Button
              variant="contained"
              onClick={() => navigate(`/template/${templateId}/response/${responseId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResponseViewer; 