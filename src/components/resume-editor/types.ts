export type SectionType =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'references';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  url?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
}

export interface ResumeStyle {
  fontFamily: string;
  fontSize: number;
  accentColor: string;
  sectionSpacing: number;
  lineHeight: number;
  showSectionHorizontalRule: boolean;
  personalSectionAlignment: 'left' | 'center' | 'right';
  sectionHeaderAlignment: 'left' | 'center' | 'right';
}

export interface ResumeData {
  personal: PersonalInfo;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillItem[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  references?: ReferenceItem[];
  activeSections: SectionType[];
  style: ResumeStyle;
}

export type ResumeAction =
  | { type: 'UPDATE_PERSONAL', payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_SUMMARY', payload: string }
  | { type: 'ADD_EXPERIENCE', payload: ExperienceItem }
  | { type: 'UPDATE_EXPERIENCE', payload: { id: string, data: Partial<ExperienceItem> } }
  | { type: 'REMOVE_EXPERIENCE', payload: string }
  | { type: 'REORDER_EXPERIENCE', payload: ExperienceItem[] }
  | { type: 'ADD_EDUCATION', payload: EducationItem }
  | { type: 'UPDATE_EDUCATION', payload: { id: string, data: Partial<EducationItem> } }
  | { type: 'REMOVE_EDUCATION', payload: string }
  | { type: 'ADD_SKILL', payload: SkillItem }
  | { type: 'UPDATE_SKILL', payload: { id: string, data: Partial<SkillItem> } }
  | { type: 'REMOVE_SKILL', payload: string }
  | { type: 'ADD_PROJECT', payload: ProjectItem }
  | { type: 'UPDATE_PROJECT', payload: { id: string, data: Partial<ProjectItem> } }
  | { type: 'REMOVE_PROJECT', payload: string }
  | { type: 'ADD_CERTIFICATION', payload: CertificationItem }
  | { type: 'UPDATE_CERTIFICATION', payload: { id: string, data: Partial<CertificationItem> } }
  | { type: 'REMOVE_CERTIFICATION', payload: string }
  | { type: 'REMOVE_LANGUAGE', payload: string }
  | { type: 'ADD_REFERENCE', payload: ReferenceItem }
  | { type: 'UPDATE_REFERENCE', payload: { id: string, data: Partial<ReferenceItem> } }
  | { type: 'REMOVE_REFERENCE', payload: string }
  | { type: 'TOGGLE_SECTION', payload: SectionType }
  | { type: 'REORDER_SECTIONS', payload: SectionType[] }
  | { type: 'LOAD_RESUME', payload: ResumeData }
  | { type: 'RESET_RESUME' }
  | { type: 'UPDATE_STYLE', payload: Partial<ResumeStyle> }
  | { type: 'RESET_STYLE' };