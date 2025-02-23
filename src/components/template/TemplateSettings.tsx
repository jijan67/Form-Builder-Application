import React from 'react';
import { Template } from '../../types';

interface TemplateSettingsProps {
  template: Template;
  onUpdate: (template: Template) => void;
  readOnly?: boolean;
}

const TemplateSettings: React.FC<TemplateSettingsProps> = ({ template, onUpdate, readOnly }) => {
  // Implementation
  return <div>Template Settings</div>;
};

export default TemplateSettings; 