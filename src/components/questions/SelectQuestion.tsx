import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Question } from '../../types';

interface SelectQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SelectQuestion = ({ question, value, onChange, disabled }: SelectQuestionProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{question.title}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {question.options?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectQuestion; 