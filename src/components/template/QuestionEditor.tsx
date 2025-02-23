import React from 'react';
import { Template, Question } from '../../types';

interface QuestionEditorProps {
  template: Template | null;
  onUpdate: (question: Question) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ template, onUpdate }) => {
  if (!template) return null;

  return (
    <div>
      {template.questions.map(question => (
        <div key={question.id}>
          {/* Question editing UI */}
        </div>
      ))}
    </div>
  );
};

export default QuestionEditor; 