import React, { useState } from 'react';
import { Template, FormResponse } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

interface TemplateResultsProps {
  template: Template;
  responses: FormResponse[];
  loading?: boolean;
}

type SortableField = 'createdAt' | 'user';

const TemplateResults: React.FC<TemplateResultsProps> = ({ 
  template, 
  responses,
  loading = false 
}) => {
  const [orderBy, setOrderBy] = useState<SortableField>('createdAt');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  
  const multiplier = orderDirection === 'asc' ? 1 : -1;

  const handleSort = (field: SortableField) => {
    if (field === orderBy) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrderDirection('asc');
    }
  };

  const getDateValue = (response: FormResponse, field: SortableField): Date => {
    if (field === 'createdAt') {
      return new Date(response.createdAt);
    }
    return new Date(0);
  };

  const getAnswerDisplay = (response: FormResponse, questionId: string) => {
    const answer = response.answers.find(a => a.questionId === questionId);
    return answer ? answer.value : '-';
  };

  const sortedResponses = [...responses].sort((a, b) => {
    if (orderBy === 'user') {
      return multiplier * a.user.name.localeCompare(b.user.name);
    }
    const aDate = getDateValue(a, orderBy);
    const bDate = getDateValue(b, orderBy);
    return multiplier * (aDate.getTime() - bDate.getTime());
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!template || !template.questions) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Template data is not available.
        </Typography>
      </Box>
    );
  }

  if (!responses.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No responses yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Responses ({responses.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'user'}
                  direction={orderDirection}
                  onClick={() => handleSort('user')}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderDirection}
                  onClick={() => handleSort('createdAt')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              {template.questions
                .filter(q => q.showInResults)
                .map(question => (
                  <TableCell key={question.id}>{question.title}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResponses.map(response => (
              <TableRow key={response.id}>
                <TableCell>{response.user.name}</TableCell>
                <TableCell>
                  {new Date(response.createdAt).toLocaleDateString()}
                </TableCell>
                {template.questions
                  .filter(q => q.showInResults)
                  .map(question => (
                    <TableCell key={question.id}>
                      {getAnswerDisplay(response, question.id)}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TemplateResults; 