import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse, Question } from '../types';

const ResponseEditor = () => {
  const { templateId, responseId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        
        // Convert answers array to object for easier editing
        const answersObj = responseData.answers.reduce((acc: any, curr: any) => {
          acc[curr.questionId] = curr.value;
          return acc;
        }, {});
        setAnswers(answersObj);
      } catch (error) {
        setError('Error loading response');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId, responseId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || !response) return;

    setSaving(true);
    try {
      const updatedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      const res = await fetch(`/api/forms/responses/${responseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: updatedAnswers,
        }),
      });

      if (!res.ok) throw new Error('Failed to update response');

      navigate(`/template/${templateId}/response/${responseId}`);
    } catch (error) {
      setError('Error saving response');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!template || !response) return <Alert severity="error">{t('response.notFound')}</Alert>;

  const canEdit = user?.isAdmin || response.user.id === user?.id;
  if (!canEdit) {
    return <Alert severity="error">{t('common.unauthorized')}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            {t('response.editing')} - {template.title}
          </Typography>

          <Grid container spacing={3}>
            {template.questions.map((question) => (
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

                  {question.type === 'checkbox' ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={answers[question.id] || false}
                          onChange={(e) => handleAnswerChange(question.id, e.target.checked)}
                        />
                      }
                      label={question.title}
                    />
                  ) : question.type === 'integer' ? (
                    <TextField
                      fullWidth
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                      inputProps={{ min: 0 }}
                    />
                  ) : question.type === 'multi-line' ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/template/${templateId}/response/${responseId}`)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
            >
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResponseEditor; 