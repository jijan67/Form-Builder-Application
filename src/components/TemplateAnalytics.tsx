import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  Button,
  ButtonGroup,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Timeline, PieChart as PieIcon, BarChart as BarIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, FormResponse, Template } from '../types';

interface AnalyticsData {
  totalResponses: number;
  dailyResponses: { date: string; count: number }[];
  questionStats: {
    [key: string]: {
      average?: number;
      median?: number;
      mode?: string | number;
      distribution: { [key: string]: number };
      timeSeriesData?: { date: string; value: number }[];
    };
  };
}

type ChartType = 'bar' | 'pie' | 'line';

const TemplateAnalytics = ({ template }: { template: Template }) => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');

  useEffect(() => {
    fetchAnalytics();
  }, [template.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/templates/${template.id}/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      setError('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;

    const headers = ['Question', 'Total Responses', 'Average', 'Median', 'Mode'];
    const rows = template.questions.map(question => {
      const stats = analytics.questionStats[question.id];
      return [
        question.title,
        stats?.distribution ? Object.values(stats.distribution).reduce((a, b) => a + b, 0) : 0,
        stats?.average?.toFixed(2) || '',
        stats?.median?.toFixed(2) || '',
        stats?.mode || '',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title}_analytics.csv`;
    a.click();
  };

  const renderChart = (question: Question, stats: any) => {
    const data = Object.entries(stats.distribution).map(([key, value]) => ({
      name: key,
      value: value as number,
    }));

    switch (selectedChartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        if (!stats.timeSeriesData) return null;
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!analytics) return <Alert severity="info">{t('analytics.noData')}</Alert>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          {t('analytics.totalResponses')}: {analytics.totalResponses}
        </Typography>
        <Box>
          <ButtonGroup sx={{ mr: 2 }}>
            <Button
              variant={selectedChartType === 'bar' ? 'contained' : 'outlined'}
              onClick={() => setSelectedChartType('bar')}
              startIcon={<BarIcon />}
            >
              {t('analytics.barChart')}
            </Button>
            <Button
              variant={selectedChartType === 'pie' ? 'contained' : 'outlined'}
              onClick={() => setSelectedChartType('pie')}
              startIcon={<PieIcon />}
            >
              {t('analytics.pieChart')}
            </Button>
            <Button
              variant={selectedChartType === 'line' ? 'contained' : 'outlined'}
              onClick={() => setSelectedChartType('line')}
              startIcon={<Timeline />}
            >
              {t('analytics.lineChart')}
            </Button>
          </ButtonGroup>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportToCSV}
          >
            {t('analytics.exportCSV')}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {template.questions.map(question => {
          const stats = analytics.questionStats[question.id];
          if (!stats) return null;

          return (
            <Grid item xs={12} md={6} key={question.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {question.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {stats.average !== undefined && (
                    <Typography>
                      {t('analytics.average')}: {stats.average.toFixed(2)}
                    </Typography>
                  )}
                  {stats.median !== undefined && (
                    <Typography>
                      {t('analytics.median')}: {stats.median.toFixed(2)}
                    </Typography>
                  )}
                  {stats.mode !== undefined && (
                    <Typography>
                      {t('analytics.mode')}: {stats.mode}
                    </Typography>
                  )}
                </Box>
                {renderChart(question, stats)}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TemplateAnalytics; 