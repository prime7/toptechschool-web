import React, { createContext, useContext, useReducer } from 'react';
import { ResumeData, ResumeAction } from '../types';

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const initialResumeData: ResumeData = {
  personal: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Software Engineer',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: 'Experienced software engineer with a passion for building scalable web applications.',
  experience: [
    {
      id: generateId(),
      company: 'Tech Company',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Leading development of web applications using modern technologies.',
      highlights: [
        'Developed new features for the company\'s flagship product',
        'Led a team of 5 developers',
        'Improved application performance by 40%'
      ]
    }
  ],
  education: [
    {
      id: generateId(),
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      current: false,
      gpa: '3.8'
    }
  ],
  skills: [
    {
      id: generateId(),
      name: 'JavaScript',
      level: 'expert'
    },
    {
      id: generateId(),
      name: 'React',
      level: 'advanced'
    },
    {
      id: generateId(),
      name: 'TypeScript',
      level: 'intermediate'
    }
  ],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
  activeSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  template: 'professional'
};

const blankResumeData: ResumeData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
  activeSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  template: 'professional'
};

const ResumeContext = createContext<{
  state: ResumeData;
  dispatch: React.Dispatch<ResumeAction>;
} | undefined>(undefined);

function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        personal: { ...state.personal, ...action.payload }
      };
    case 'UPDATE_SUMMARY':
      return {
        ...state,
        summary: action.payload
      };
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [...state.experience, action.payload]
      };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter(item => item.id !== action.payload)
      };
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [...state.education, action.payload]
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(item => item.id !== action.payload)
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload]
      };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(item => item.id !== action.payload)
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(item => item.id !== action.payload)
      };
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        certifications: [...state.certifications, action.payload]
      };
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.filter(item => item.id !== action.payload)
      };
    case 'ADD_LANGUAGE':
      return {
        ...state,
        languages: [...state.languages, action.payload]
      };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter(item => item.id !== action.payload)
      };
    case 'ADD_REFERENCE':
      return {
        ...state,
        references: [...state.references, action.payload]
      };
    case 'UPDATE_REFERENCE':
      return {
        ...state,
        references: state.references.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_REFERENCE':
      return {
        ...state,
        references: state.references.filter(item => item.id !== action.payload)
      };
    case 'TOGGLE_SECTION':
      return {
        ...state,
        activeSections: state.activeSections.includes(action.payload)
          ? state.activeSections.filter(section => section !== action.payload)
          : [...state.activeSections, action.payload]
      };
    case 'REORDER_SECTIONS':
      return {
        ...state,
        activeSections: action.payload
      };
    case 'CHANGE_TEMPLATE':
      return {
        ...state,
        template: action.payload
      };
    case 'LOAD_RESUME':
      return action.payload;
    case 'RESET_RESUME':
      return initialResumeData;
    default:
      return state;
  }
}

export function ResumeProvider({ children, initialState }: { children: React.ReactNode, initialState?: ResumeData }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState || initialResumeData);
  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}