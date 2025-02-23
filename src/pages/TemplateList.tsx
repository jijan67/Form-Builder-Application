import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { Template } from '../types';
import { useNavigate } from 'react-router-dom';

const TemplateList = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Implement API call to fetch templates
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Templates
        </Typography>
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card 
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/template/${template.id}`)}
              >
                {template.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={template.imageUrl}
                    alt={template.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{template.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {template.tags.map((tag) => (
                      <Typography
                        key={tag}
                        variant="caption"
                        sx={{
                          mr: 1,
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          padding: '2px 6px',
                          borderRadius: 1,
                        }}
                      >
                        {tag}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default TemplateList; 