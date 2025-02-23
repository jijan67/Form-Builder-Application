import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Comment } from '../types';

interface CommentsProps {
  templateId: string;
}

const Comments = ({ templateId }: CommentsProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(`ws://localhost:3001`);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'join',
        templateId,
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'initial':
          setComments(data.comments);
          break;
        case 'new_comment':
          setComments(prev => [...prev, data.comment]);
          break;
      }
    };

    socket.onclose = () => {
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 3000);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [templateId]);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !newComment.trim()) return;

    ws.send(JSON.stringify({
      type: 'comment',
      content: newComment,
    }));

    setNewComment('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('comments.title')}
      </Typography>

      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <Paper sx={{ p: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 1 }}>
                  {comment.user.name.charAt(0)}
                </Avatar>
                <Typography variant="subtitle2">
                  {comment.user.name}
                </Typography>
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography>{comment.content}</Typography>
            </Paper>
          </ListItem>
        ))}
      </List>

      {user && (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.placeholder')}
            sx={{ mb: 1 }}
          />
          <Button type="submit" variant="contained">
            {t('comments.submit')}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Comments; 