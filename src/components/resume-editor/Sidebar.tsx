import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { useResume } from './context/ResumeContext';
import { SectionType } from './types';
import { User, FileText, Briefcase, GraduationCap, Calendar, Plus, GripVertical, Layout, Type, Share2, Copy, Check } from 'lucide-react'; // Added Share2, Copy, Check
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

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
  const [isLoadingSharing, setIsLoadingSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Ensure window.location.origin is only accessed on the client side
    setOrigin(window.location.origin);
  }, []);

  const sections: SectionInfo[] = [
    { id: 'personal', label: 'Personal Information', icon: <User className="h-4 w-4" /> },
    { id: 'summary', label: 'Professional Summary', icon: <FileText className="h-4 w-4" /> },
    { id: 'work', label: 'Work Experience', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'projects', label: 'Projects', icon: <Calendar className="h-4 w-4" /> },
  ];

  const availableSections = sections.filter(section => {
    if (state.activeSections.includes(section.id)) return false;
    
    // Check if section has content
    switch (section.id) {
      case 'summary':
        return !state.summary;
      case 'work':
        return !state.work || state.work.length === 0;
      case 'education':
        return !state.education || state.education.length === 0;
      case 'projects':
        return !state.projects || state.projects.length === 0;
      default:
        return true;
    }
  });

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
    
    const targetIndex = index === 0 && newSections[0] === 'personal' ? 1 : index;
    newSections.splice(targetIndex, 0, removed);
    
    if (newSections.includes('personal') && newSections[0] !== 'personal') {
        const personalIndex = newSections.indexOf('personal');
        newSections.splice(personalIndex, 1);
        newSections.unshift('personal');
    }

    dispatch({ type: 'REORDER_SECTIONS', payload: newSections });
  };

  const handleStyleChange = (key: keyof typeof state.style, value: string | number | boolean) => {
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { [key]: value }
    });
  };

  return (
    <Card className="p-2 border-0 shadow-none h-full w-[280px] flex flex-col">
      <CardContent className="p-0 flex flex-col flex-1">
        <Tabs defaultValue="sections" className="w-full flex-1">
          <TabsList className="w-full grid grid-cols-3"> {/* Adjusted grid-cols */}
            <TabsTrigger value="sections" className="flex items-center gap-2 text-xs p-1 md:p-2"> {/* Adjusted padding and text size */}
              <Layout className="h-3 w-3 md:h-4 md:w-4" /> {/* Adjusted icon size */}
              Sections
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center gap-2 text-xs p-1 md:p-2"> {/* Adjusted padding and text size */}
              <Type className="h-3 w-3 md:h-4 md:w-4" /> {/* Adjusted icon size */}
              Styling
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2 text-xs p-1 md:p-2"> {/* Added Share Tab */}
              <Share2 className="h-3 w-3 md:h-4 md:w-4" /> {/* Adjusted icon size */}
              Share
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sections">
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
          </TabsContent>

          <TabsContent value="styling">
            <div className="px-4 py-2 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select 
                    value={state.style.fontFamily}
                    onValueChange={(value) => handleStyleChange('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[state.style.fontSize]} 
                      onValueChange={([value]) => handleStyleChange('fontSize', value)}
                      max={13} 
                      min={10} 
                      step={.2} 
                    />
                    <span className="w-12 text-sm">{state.style.fontSize}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded-md cursor-pointer border border-input" 
                      value={state.style.accentColor}
                      onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    />
                    <Input 
                      type="text" 
                      value={state.style.accentColor}
                      onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Section Spacing</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[state.style.sectionSpacing]} 
                      onValueChange={([value]) => handleStyleChange('sectionSpacing', value)}
                      max={18} 
                      min={10} 
                      step={2} 
                    />
                    <span className="w-12 text-sm">{state.style.sectionSpacing}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      value={[state.style.lineHeight]} 
                      onValueChange={([value]) => handleStyleChange('lineHeight', value)}
                      max={2} 
                      min={1} 
                      step={0.1} 
                    />
                    <span className="w-12 text-sm">{state.style.lineHeight}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Personal Info Alignment</Label>
                  <Select 
                    value={state.style.personalSectionAlignment}
                    onValueChange={(value) => handleStyleChange('personalSectionAlignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Section Header Alignment</Label>
                  <Select 
                    value={state.style.sectionHeaderAlignment}
                    onValueChange={(value) => handleStyleChange('sectionHeaderAlignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Selection Dropdown */}
                <div className="space-y-2">
                  <Label>Resume Template</Label>
                  <Select
                    value={state.style.templateId || 'default'} // Ensure a default value if undefined
                    onValueChange={(value) => handleStyleChange('templateId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="template2">Template 2</SelectItem>
                      {/* Add more templates here as they are created */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label>Show Section Dividers</Label>
                  <Switch
                    checked={state.style.showSectionHorizontalRule}
                    onCheckedChange={(checked) => handleStyleChange('showSectionHorizontalRule', checked)}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => dispatch({ type: 'RESET_STYLE' })}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Share Tab Content START */}
          <TabsContent value="share">
            <div className="px-4 py-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublic" className="font-medium">Make Resume Public</Label>
                  <Switch
                    id="isPublic"
                    checked={state.isPublic ?? false}
                    onCheckedChange={async (newIsPublic) => {
                      if (!state.id) {
                        // TODO: Show a toast message: "Please save your resume first to enable sharing."
                        console.error("Resume ID is not available. Save the resume first.");
                        return;
                      }
                      setIsLoadingSharing(true);
                      try {
                        const response = await fetch(`/api/resume/${state.id}/share`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isPublic: newIsPublic }),
                        });
                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Failed to update sharing status');
                        }
                        const data = await response.json();
                        dispatch({
                          type: 'UPDATE_SHARING_SETTINGS',
                          payload: {
                            isPublic: data.isPublic,
                            sharedId: data.sharedId, // Ensure API returns sharedId
                            lastSharedAt: data.lastSharedAt,
                          },
                        });
                      } catch (error) {
                        console.error("Error updating sharing status:", error);
                        // TODO: Show toast error to user
                      } finally {
                        setIsLoadingSharing(false);
                      }
                    }}
                    disabled={isLoadingSharing || !state.id}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Making your resume public will generate a shareable link. Anyone with the link will be able to view your resume.
                </p>
              </div>

              {state.isPublic && state.sharedId && (
                <div className="space-y-3">
                  <Label className="font-medium">Shareable Link</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={`${origin}/resume/shared/${state.sharedId}`}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(`${origin}/resume/shared/${state.sharedId}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {state.lastSharedAt && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(state.lastSharedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {!state.id && (
                <p className="text-xs text-destructive text-center">
                  Save your resume to enable sharing.
                </p>
              )}
            </div>
          </TabsContent>
          {/* Share Tab Content END */}

        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SectionsList;