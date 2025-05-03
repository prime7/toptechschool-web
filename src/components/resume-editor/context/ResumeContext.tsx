import React, { createContext, useContext, useReducer } from 'react';
import { ResumeData, ResumeAction } from '../types';
import { generateId } from '../utils';
import { defaultStyle } from '../constants'


const initialResumeData: ResumeData = {
  personal: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    website: 'https://johndoe.dev',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  },
  summary: 'Experienced software engineer with 8+ years of experience in building scalable web applications. Specialized in frontend development with React and TypeScript, with a strong focus on performance optimization and user experience.',
  experience: [
    {
      id: generateId(),
      company: 'Tech Company',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '',
      description: 'Leading development of web applications using modern technologies.',
      highlights: [
        'Developed new features for the company\'s flagship product',
        'Led a team of 5 developers',
        'Improved application performance by 40%',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Mentored junior developers and conducted code reviews'
      ]
    },
    {
      id: generateId(),
      company: 'Startup Inc',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      description: 'Developed and maintained web applications using React and Redux.',
      highlights: [
        'Built responsive user interfaces for multiple products',
        'Integrated third-party APIs and services',
        'Optimized application load time by 30%',
        'Implemented automated testing suite'
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
    },
    {
      id: generateId(),
      institution: 'Tech Bootcamp',
      degree: 'Full Stack Web Development',
      field: 'Web Development',
      startDate: '2016-06',
      endDate: '2016-12',
      current: false,
      gpa: '4.0'
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
    },
    {
      id: generateId(),
      name: 'Node.js',
      level: 'advanced'
    },
    {
      id: generateId(),
      name: 'GraphQL',
      level: 'intermediate'
    },
    {
      id: generateId(),
      name: 'AWS',
      level: 'intermediate'
    }
  ],
  projects: [
    {
      id: generateId(),
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce platform built with React and Node.js',
      url: 'https://github.com/johndoe/ecommerce',
      startDate: '',
      endDate: '',
      highlights: []
    },
    {
      id: generateId(),
      name: 'Task Management App',
      description: 'Real-time task management application with collaborative features',
      url: 'https://github.com/johndoe/taskmanager',
      startDate: '',
      endDate: '',
      highlights: []
    }
  ],
  certifications: [
    {
      id: generateId(),
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2021-06',
      url: 'https://aws.amazon.com/certification'
    },
    {
      id: generateId(),
      name: 'React Advanced Patterns',
      issuer: 'Frontend Masters',
      date: '2020-03',
      url: 'https://frontendmasters.com'
    }
  ],
  references: [
    {
      id: generateId(),
      name: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Company',
      email: 'jane.smith@techcompany.com',
      phone: '(555) 987-6543'
    }
  ],
  activeSections: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'references'],
  style: defaultStyle
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
  references: [],
  activeSections: ['personal', 'summary', 'experience', 'education', 'skills'],
  style: defaultStyle
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
    case 'LOAD_RESUME':
      return action.payload;
    case 'RESET_RESUME':
      return initialResumeData;
    case 'UPDATE_STYLE':
      return {
        ...state,
        style: { ...state.style, ...action.payload }
      };
    case 'RESET_STYLE':
      return {
        ...state,
        style: defaultStyle
      };
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