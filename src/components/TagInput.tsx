import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = ({ value, onChange }: TagInputProps) => {
  const { t } = useLanguage();
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      if (inputValue.trim()) {
        const response = await fetch(`/api/tags/search?q=${inputValue}`);
        const data = await response.json();
        setOptions(data.map((tag: any) => tag.name));
      }
    };

    fetchTags();
  }, [inputValue]);

  return (
    <Autocomplete
      multiple
      freeSolo
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      options={options}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('template.tags')}
          placeholder={t('template.addTags')}
        />
      )}
    />
  );
};

export default TagInput; 