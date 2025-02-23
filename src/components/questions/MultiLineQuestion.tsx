import { TextField } from '@mui/material';
import { Question } from '../../types';

interface MultiLineQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MultiLineQuestion = ({ question, value, onChange, disabled }: MultiLineQuestionProps) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      label={question.title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      helperText={question.description}
    />
  );
};

export default MultiLineQuestion; 