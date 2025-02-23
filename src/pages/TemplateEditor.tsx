import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Template, Question, User, QuestionType } from '../types';
import { mockApi } from '../mocks/data';

type QuestionTypeLimit = Record<QuestionType, number>;

const QUESTION_LIMITS: QuestionTypeLimit = {
  text: 4,
  'multi-line': 4,
  integer: 4,
  checkbox: 4,
  select: 4,
};

const TemplateEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [template, setTemplate] = useState<Partial<Template>>({
    title: '',
    description: '',
    topic: '',
    imageUrl: '',
    tags: [],
    questions: [],
    isPublic: true,
    allowedUsers: [],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [topics] = useState(['Education', 'Quiz', 'Feedback', 'Employment', 'Other']);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (templateId) {
        const templateData = await mockApi.templates.getById(templateId);
        if (templateData) {
          setTemplate(templateData);
        }
      }
      const tags = await mockApi.tags.getAll();
      setAvailableTags(tags.map(t => t.name));
      const users = await mockApi.users.getAll();
      setAvailableUsers(users);
    };
    loadData();
  }, [templateId]);

  const handleQuestionReorder = (result: any) => {
    if (!result.destination) return;

    const questions = Array.from(template.questions || []);
    const [reorderedItem] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedItem);

    questions.forEach((q, index) => {
      q.order = index;
    });

    setTemplate({ ...template, questions });
  };

  const addQuestion = (type: QuestionType) => {
    const questions = template.questions || [];
    const typeCount = questions.filter(q => q.type === type).length;

    const limit = QUESTION_LIMITS[type];
    if (typeCount >= limit) {
      setError(`Maximum ${limit} ${type} questions allowed`);
      return;
    }

    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      type,
      order: questions.length,
      showInResults: true,
    };

    setTemplate({
      ...template,
      questions: [...questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const questions = template.questions?.map((q, i) =>
      i === index ? { ...q, ...updates } : q
    );
    setTemplate({ ...template, questions });
  };

  const removeQuestion = (index: number) => {
    const questions = template.questions?.filter((_, i) => i !== index);
    setTemplate({ ...template, questions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (templateId) {
        await mockApi.templates.update(templateId, template);
      } else {
        await mockApi.templates.create({
          ...template,
          author: user!,
        });
      }
      navigate('/profile');
    } catch (error) {
      setError('Failed to save template');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {templateId ? t('template.edit') : t('template.create')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('template.title')}
            value={template.title}
            onChange={(e) => setTemplate({ ...template, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom>{t('template.description')}</Typography>
          <Box sx={{ mb: 2 }}>
            <MDEditor
              value={template.description}
              onChange={(value) => setTemplate({ ...template, description: value || '' })}
              preview="edit"
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('template.topic')}</InputLabel>
            <Select
              value={template.topic}
              onChange={(e) => setTemplate({ ...template, topic: e.target.value })}
              required
            >
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t('template.imageUrl')}
            value={template.imageUrl}
            onChange={(e) => setTemplate({ ...template, imageUrl: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Autocomplete
            multiple
            freeSolo
            options={availableTags}
            value={template.tags}
            onChange={(_, newValue) => setTemplate({ ...template, tags: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label={t('template.tags')} />
            )}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={template.isPublic}
                onChange={(e) => setTemplate({ ...template, isPublic: e.target.checked })}
              />
            }
            label={t('template.public')}
            sx={{ mb: 2 }}
          />

          {!template.isPublic && (
            <Autocomplete
              multiple
              options={availableUsers}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={template.allowedUsers}
              onChange={(_, newValue) => setTemplate({ ...template, allowedUsers: newValue })}
              renderInput={(params) => (
                <TextField {...params} label={t('template.allowedUsers')} />
              )}
              sx={{ mb: 2 }}
            />
          )}

          <Typography variant="h6" gutterBottom>
            {t('template.questions')}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Button onClick={() => addQuestion('text')} sx={{ mr: 1 }}>
              {t('question.addText')}
            </Button>
            <Button onClick={() => addQuestion('multi-line')} sx={{ mr: 1 }}>
              {t('question.addMultiLine')}
            </Button>
            <Button onClick={() => addQuestion('integer')} sx={{ mr: 1 }}>
              {t('question.addInteger')}
            </Button>
            <Button onClick={() => addQuestion('checkbox')}>
              {t('question.addCheckbox')}
            </Button>
          </Box>

          <DragDropContext onDragEnd={handleQuestionReorder}>
            <Droppable droppableId="questions">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {template.questions?.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 2 }}
                        >
                          <TextField
                            fullWidth
                            label={t('question.title')}
                            value={question.title}
                            onChange={(e) =>
                              updateQuestion(index, { title: e.target.value })
                            }
                            sx={{ mb: 1 }}
                          />
                          <TextField
                            fullWidth
                            label={t('question.description')}
                            value={question.description}
                            onChange={(e) =>
                              updateQuestion(index, { description: e.target.value })
                            }
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={question.showInResults}
                                onChange={(e) =>
                                  updateQuestion(index, {
                                    showInResults: e.target.checked,
                                  })
                                }
                              />
                            }
                            label={t('question.showInResults')}
                          />
                          <Button
                            color="error"
                            onClick={() => removeQuestion(index)}
                          >
                            {t('question.remove')}
                          </Button>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" size="large">
              {templateId ? t('template.save') : t('template.create')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TemplateEditor; 