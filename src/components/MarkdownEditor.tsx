import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Paper,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MarkdownEditor = ({ value, onChange, disabled }: MarkdownEditorProps) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label={t('template.write')} />
        <Tab label={t('template.preview')} />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 ? (
          <TextField
            fullWidth
            multiline
            rows={6}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={t('template.markdownSupported')}
          />
        ) : (
          <Paper sx={{ p: 2 }}>
            <ReactMarkdown>{value}</ReactMarkdown>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default MarkdownEditor; 