import React from 'react';
import { useResume } from './context/ResumeContext';
import { TemplateType } from './types';
import { Layout, Minimize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumePreview from './ResumePreview';

interface TemplateSelectorProps {
  onClose: () => void;
}

interface TemplateOption {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const templates: TemplateOption[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and traditional layout perfect for most industries',
    icon: <Layout className="h-5 w-5" />,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    icon: <Minimize className="h-5 w-5" />,
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onClose }) => {
  const { state, dispatch } = useResume();
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>(state.template);
  const [hoveredTemplate, setHoveredTemplate] = React.useState<TemplateType | null>(null);

  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  const handleApply = () => {
    dispatch({ type: 'CHANGE_TEMPLATE', payload: selectedTemplate });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Choose Template</h2>
            <p className="text-sm text-gray-500">Select a template that best fits your needs</p>
          </div>
          <Button
            variant='outline'
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer rounded-lg overflow-hidden flex items-center justify-center ${
                  selectedTemplate === template.id
                    ? 'border-2 border-primary ring-2 ring-primary/20'
                    : 'border hover:border-primary/50'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                <div className="w-full flex items-center justify-center overflow-hidden">
                  <div style={{ zoom: 0.5 }}>
                    <ResumePreview template={template.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {hoveredTemplate ? (
              <span>Hovering over: {templates.find(t => t.id === hoveredTemplate)?.name}</span>
            ) : (
              <span>Select a template to preview</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;