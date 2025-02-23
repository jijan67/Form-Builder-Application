import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper } from '@mui/material';
import { Question } from '../types';

interface QuestionListProps {
  questions: Question[];
  onReorder: (questions: Question[]) => void;
  renderQuestion: (question: Question) => React.ReactNode;
}

const QuestionList = ({ questions, onReorder, renderQuestion }: QuestionListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onReorder(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {questions.map((question, index) => (
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
                    sx={{ mb: 2, p: 2 }}
                  >
                    {renderQuestion(question)}
                  </Paper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuestionList; 