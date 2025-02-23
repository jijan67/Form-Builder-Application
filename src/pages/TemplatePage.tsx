import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TemplateSettings from '../components/template/TemplateSettings';
import QuestionEditor from '../components/template/QuestionEditor';
import TemplateResults from '../components/template/TemplateResults';
import TemplateAnalytics from '../components/template/TemplateAnalytics';
import Comments from '../components/Comments';
import { Template, FormResponse, Question } from '../types';
import { mockTemplates, mockResponses } from '../mocks/data';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TemplatePage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [template, setTemplate] = useState<Template | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setResponsesLoading(true);
        const data = mockResponses.filter(r => r.template.id === templateId);
        setResponses(data);
      } catch (error) {
        console.error('Error fetching responses:', error);
      } finally {
        setResponsesLoading(false);
      }
    };

    if (template) {
      fetchResponses();
    }
  }, [template, templateId]);

  const fetchTemplate = async () => {
    try {
      setTemplateLoading(true);
      const data = mockTemplates.find(t => t.id === templateId);
      if (!data) {
        throw new Error('Template not found');
      }
      setTemplate(data);
    } catch (error) {
      setError('Error loading template');
    } finally {
      setTemplateLoading(false);
    }
  };

  const canEdit = user && (user.isAdmin || (template && template.author.id === user.id));
  const canView = template?.isPublic || canEdit || (template?.allowedUsers || []).some(u => u.id === user?.id);

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    if (!template) return;
    
    const updatedQuestions = template.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    
    setTemplate({
      ...template,
      questions: updatedQuestions,
    });
  };

  if (templateLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!template) return <Alert severity="error">{t('template.notFound')}</Alert>;
  if (!canView) return <Alert severity="error">{t('template.noAccess')}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t('template.settings')} />
          {canEdit && <Tab label={t('template.questions')} />}
          <Tab label={t('template.results')} />
          <Tab label={t('template.analytics')} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <TemplateSettings
            template={template}
            onUpdate={setTemplate}
            readOnly={!canEdit}
          />
        </TabPanel>

        {canEdit && (
          <TabPanel value={activeTab} index={1}>
            <QuestionEditor
              template={template}
              onUpdate={handleQuestionUpdate}
            />
          </TabPanel>
        )}

        <TabPanel value={activeTab} index={canEdit ? 2 : 1}>
          <TemplateResults 
            template={template} 
            responses={responses}
            loading={responsesLoading}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={canEdit ? 3 : 2}>
          <TemplateAnalytics template={template} />
        </TabPanel>

        {/* Comments section always visible at bottom */}
        <Box sx={{ mt: 4, px: 3, pb: 3 }}>
          <Comments templateId={template.id} />
        </Box>
      </Paper>
    </Container>
  );
};

export default TemplatePage; 