import { FormControlLabel, Checkbox } from '@mui/material';
import { Question } from '../../types';

interface CheckboxQuestionProps {
  question: Question;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const CheckboxQuestion = ({ question, value, onChange, disabled }: CheckboxQuestionProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      }
      label={question.title}
    />
  );
};

export default CheckboxQuestion; 