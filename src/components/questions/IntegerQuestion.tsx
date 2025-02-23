import { TextField } from '@mui/material';
import { Question } from '../../types';

interface IntegerQuestionProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const IntegerQuestion = ({ question, value, onChange, disabled }: IntegerQuestionProps) => {
  return (
    <TextField
      fullWidth
      type="number"
      label={question.title}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={disabled}
      helperText={question.description}
    />
  );
};

export default IntegerQuestion; 