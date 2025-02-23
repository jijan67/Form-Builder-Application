import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
} from '@mui/material';
import { Template, Question, FormResponse as FormResponseType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface FormResponseProps {
  template: Template;
  questions: Question[];
  existingResponse?: FormResponseType;
  readOnly?: boolean;
}

const FormResponse = ({
  template,
  questions,
  existingResponse,
  readOnly = false,
}: FormResponseProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [emailCopy, setEmailCopy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existingResponse) {
      const answerMap = existingResponse.answers.reduce((acc, answer) => ({
        ...acc,
        [answer.questionId]: answer.value,
      }), {});
      setAnswers(answerMap);
    }
  }, [existingResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          userId: user.id,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
          emailCopy,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      setSuccess(true);
      setError(null);
    } catch (error) {
      setError('Error submitting form. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {questions.sort((a, b) => a.order - b.order).map((question) => (
        <Paper key={question.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{question.title}</Typography>
          {question.description && (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {question.description}
            </Typography>
          )}

          {question.type === 'text' && (
            <TextField
              fullWidth
              value={answers[question.id] || ''}
              onChange={(e) =>
                setAnswers({ ...answers, [question.id]: e.target.value })
              }
              disabled={readOnly}
            />
          )}

          {question.type === 'multi-line' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[question.id] || ''}
              onChange={(e) =>
                setAnswers({ ...answers, [question.id]: e.target.value })
              }
              disabled={readOnly}
            />
          )}

          {question.type === 'integer' && (
            <TextField
              type="number"
              fullWidth
              value={answers[question.id] || ''}
              onChange={(e) =>
                setAnswers({ ...answers, [question.id]: parseInt(e.target.value) })
              }
              disabled={readOnly}
            />
          )}

          {question.type === 'checkbox' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={answers[question.id] || false}
                  onChange={(e) =>
                    setAnswers({ ...answers, [question.id]: e.target.checked })
                  }
                  disabled={readOnly}
                />
              }
              label={question.title}
            />
          )}
        </Paper>
      ))}

      {!readOnly && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={emailCopy}
                onChange={(e) => setEmailCopy(e.target.checked)}
              />
            }
            label={t('form.emailCopy')}
          />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{t('form.submitSuccess')}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {t('form.submit')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default FormResponse; 