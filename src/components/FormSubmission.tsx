import { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, FormResponse } from '../types';
import TextQuestion from './questions/TextQuestion';
import MultiLineQuestion from './questions/MultiLineQuestion';
import IntegerQuestion from './questions/IntegerQuestion';
import CheckboxQuestion from './questions/CheckboxQuestion';
import SelectQuestion from './questions/SelectQuestion';

interface FormSubmissionProps {
  template: Template;
  onSubmit: (response: FormResponse) => void;
}

const FormSubmission = ({ template, onSubmit }: FormSubmissionProps) => {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [sendCopy, setSendCopy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          answers,
          sendCopy,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      setError('Error submitting form');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {template.questions.map((question) => (
        <Box key={question.id} sx={{ mb: 3 }}>
          {question.type === 'text' && (
            <TextQuestion
              question={question}
              value={answers[question.id] || ''}
              onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            />
          )}
          {question.type === 'multi-line' && (
            <MultiLineQuestion
              question={question}
              value={answers[question.id] || ''}
              onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            />
          )}
          {question.type === 'integer' && (
            <IntegerQuestion
              question={question}
              value={answers[question.id] || ''}
              onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            />
          )}
          {question.type === 'checkbox' && (
            <CheckboxQuestion
              question={question}
              value={answers[question.id] || false}
              onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            />
          )}
          {question.type === 'select' && (
            <SelectQuestion
              question={question}
              value={answers[question.id] || ''}
              onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            />
          )}
        </Box>
      ))}

      <FormControlLabel
        control={
          <Checkbox
            checked={sendCopy}
            onChange={(e) => setSendCopy(e.target.checked)}
          />
        }
        label={t('form.emailCopy')}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        {t('form.submit')}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FormSubmission; 