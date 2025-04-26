import React, { useState } from 'react';
import { useResume } from './context/ResumeContext';
import { SectionType } from './types';
import { User, FileText, Briefcase, GraduationCap, Award, Calendar, BookOpen, Globe, Users, Plus, GripVertical, Layout } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionsListProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

interface SectionInfo {
  id: SectionType;
  label: string;
  icon: React.ReactNode;
}

const SectionsList: React.FC<SectionsListProps> = ({ activeSection, setActiveSection }) => {
  const { state, dispatch } = useResume();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  const sections: SectionInfo[] = [
    { id: 'personal', label: 'Personal Information', icon: <User className="h-4 w-4" /> },
    { id: 'summary', label: 'Professional Summary', icon: <FileText className="h-4 w-4" /> },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Award className="h-4 w-4" /> },
    { id: 'projects', label: 'Projects', icon: <Calendar className="h-4 w-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'languages', label: 'Languages', icon: <Globe className="h-4 w-4" /> },
    { id: 'references', label: 'References', icon: <Users className="h-4 w-4" /> }
  ];

  const availableSections = sections.filter(section => 
    !state.activeSections.includes(section.id)
  );

  const toggleSection = (sectionId: SectionType) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: sectionId });
    
    if (sectionId === activeSection && !state.activeSections.includes(sectionId)) {
      setActiveSection(state.activeSections[0] || 'personal');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const sectionId = state.activeSections[index];
    if (sectionId === 'personal') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex === index) return;

    const newSections = [...state.activeSections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    
    dispatch({ type: 'REORDER_SECTIONS', payload: newSections });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-4 py-2">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 h-auto"
            onClick={() => setShowTemplateSelector(true)}
          >
            <Layout className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Change Template</span>
          </Button>
          <div className="px-4 text-xs text-muted-foreground">
            Current template: <span className="font-medium capitalize">{state.template}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Separator className="my-2" />
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="px-1 py-2">
            {state.activeSections.length > 0 && (
              <div className="space-y-1 mb-4">
                {state.activeSections.map((sectionId, index) => {
                  const section = sections.find(s => s.id === sectionId);
                  if (!section) return null;
                  
                  return (
                    <div
                      key={section.id}
                      draggable={section.id !== 'personal'}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer group",
                        activeSection === section.id 
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-foreground hover:bg-muted border-l-2 border-transparent"
                      )}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.id !== 'personal' && (
                        <GripVertical className="h-4 w-4 mr-2 text-muted-foreground cursor-grab" />
                      )}
                      <span className="mr-3">{section.icon}</span>
                      <span className="font-medium">{section.label}</span>
                      {section.id !== 'personal' && (
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.id);
                          }}
                        >
                          <span className="sr-only">Remove section</span>
                          &times;
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {availableSections.length > 0 && (
              <React.Fragment>
                <div className="px-3 mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Add Sections</h3>
                </div>
                <div className="space-y-1">
                  {availableSections.map(section => (
                    <div 
                      key={section.id}
                      className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => {
                        toggleSection(section.id);
                        setActiveSection(section.id);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="mr-3">{section.icon}</span>
                      <span>{section.label}</span>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      {showTemplateSelector && (
        <TemplateSelector onClose={() => setShowTemplateSelector(false)} />
      )}
    </Card>
  );
};

export default SectionsList;