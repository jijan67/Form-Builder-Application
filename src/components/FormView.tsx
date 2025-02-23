import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Alert,
  FormGroup,
  FormControl,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse, Question, Answer } from '../types';
import { mockApi } from '../mocks/data';

interface FormViewProps {
  template: Template;
  response?: FormResponse;
  readOnly?: boolean;
}

const FormView = ({ template, response, readOnly = false }: FormViewProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sendCopy, setSendCopy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (response) {
      const initialAnswers: Record<string, any> = {};
      response.answers.forEach((answer) => {
        initialAnswers[answer.questionId] = answer.value;
      });
      setAnswers(initialAnswers);
    }
  }, [response]);

  const handleAnswerChange = (questionId: string, value: any) => {
    if (readOnly) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    try {
      const formattedAnswers: Answer[] = template.questions.map((question) => ({
        questionId: question.id,
        value: answers[question.id] || '',
      }));

      const newResponse: Partial<FormResponse> = {
        template,
        user: user!,
        answers: formattedAnswers,
        createdAt: new Date(),
      };

      if (response) {
        await mockApi.responses.update(response.id, newResponse);
      } else {
        await mockApi.responses.create(newResponse);
        if (sendCopy) {
          // In a real app, this would send an email
          console.log('Sending email copy to:', user?.email);
        }
      }

      // Redirect or show success message
    } catch (error) {
      setError('Failed to save response');
    }
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            disabled={readOnly}
            helperText={question.description}
            margin="normal"
          />
        );

      case 'multi-line':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            disabled={readOnly}
            helperText={question.description}
            margin="normal"
          />
        );

      case 'integer':
        return (
          <TextField
            fullWidth
            type="number"
            label={question.title}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value, 10))}
            disabled={readOnly}
            helperText={question.description}
            margin="normal"
            inputProps={{ min: 0 }}
          />
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleAnswerChange(question.id, e.target.checked)}
                disabled={readOnly}
              />
            }
            label={question.title}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {template.title}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          {template.questions.map((question) => (
            <FormControl key={question.id} fullWidth>
              {renderQuestion(question)}
            </FormControl>
          ))}
        </FormGroup>

        {!readOnly && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendCopy}
                  onChange={(e) => setSendCopy(e.target.checked)}
                />
              }
              label={t('form.sendCopy')}
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" size="large">
                {response ? t('form.update') : t('form.submit')}
              </Button>
            </Box>
          </>
        )}
      </form>
    </Paper>
  );
};

export default FormView; 