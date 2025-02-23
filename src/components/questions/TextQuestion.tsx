import { TextField } from '@mui/material';
import { Question } from '../../types';

interface TextQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TextQuestion = ({ question, value, onChange, disabled }: TextQuestionProps) => {
  return (
    <TextField
      fullWidth
      label={question.title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      helperText={question.description}
    />
  );
};

export default TextQuestion; 