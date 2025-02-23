import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  TextField,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { Template, Question, FormResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [template, setTemplate] = useState<Template | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // TODO: Fetch template details, questions, and responses
    const fetchTemplateData = async () => {
      try {
        // Fetch template details
        // Fetch questions
        // Fetch responses if user has access
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    if (id) {
      fetchTemplateData();
    }
  }, [id]);

  const handleQuestionAdd = () => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      title: 'New Question',
      description: '',
      type: 'text',
      order: questions.length,
      showInResults: true,
      templateId: id!,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionDelete = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {template && (
        <>
          <Paper sx={{ mb: 4 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">{template.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {template.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {template.tags.map(tag => (
                  <Chip key={tag} label={tag} sx={{ mr: 1 }} />
                ))}
              </Box>
            </Box>
          </Paper>

          <Paper>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="Settings" />
              <Tab label="Questions" />
              <Tab label="Responses" />
              <Tab label="Analytics" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              {/* Settings Form */}
              <Box component="form">
                <TextField
                  fullWidth
                  label="Title"
                  value={template.title}
                  margin="normal"
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={template.description}
                  margin="normal"
                  multiline
                  rows={4}
                  disabled={!isEditing}
                />
                {/* Add more settings fields */}
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {/* Questions List */}
              <Box>
                {questions.map((question, index) => (
                  <Paper key={question.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <DragIcon />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">{question.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {question.description}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => handleQuestionDelete(question.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button variant="outlined" onClick={handleQuestionAdd}>
                  Add Question
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {/* Responses List */}
              {responses.map(response => (
                <Paper key={response.id} sx={{ p: 2, mb: 2 }}>
                  {/* Display response data */}
                </Paper>
              ))}
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              {/* Analytics */}
              <Typography>Coming soon...</Typography>
            </TabPanel>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default TemplateDetail; 