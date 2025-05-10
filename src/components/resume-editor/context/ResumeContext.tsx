import React, { createContext, useContext, useReducer } from 'react';
import { ResumeData, ResumeAction } from '../types';
import { generateId } from '../utils';
import { defaultStyle } from '../constants'


const initialResumeData: ResumeData = {
  activeSections: ['personal', 'summary', 'experience', 'education', 'skills'],
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
      description: 'Led development of web applications using modern technologies',
      bulletPoints: [
        'Managed a team of 5 developers',
        'Implemented CI/CD pipelines',
        'Improved application performance by 40%',
        'Reduced deployment time by 60%',
        'Mentored junior developers'
      ]
    },
    {
      id: generateId(),
      company: 'Startup Inc',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      description: 'Developed responsive UIs using React and Redux',
      bulletPoints: [
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
      degree: 'Bachelor',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-06',
      current: false,
      description: 'Graduated with honors. Specialized in software engineering and data structures.',
      bulletPoints: [
        'Data Structures and Algorithms',
        'Software Engineering',
        'Database Systems',
        'Web Development'
      ],
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
      description: 'Intensive 6-month bootcamp covering modern web development technologies and practices.',
      bulletPoints: [],
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
      description: 'Developed a full-featured e-commerce platform using React, Node.js, and MongoDB.',
      bulletPoints: [
        'User authentication',
        'Product catalog with search and filtering',
        'Shopping cart and checkout process',
        'Admin dashboard for managing products and orders'
      ],
      url: 'https://github.com/johndoe/ecommerce'
    },
    {
      id: generateId(),
      name: 'Personal Portfolio',
      description: 'Designed and developed a personal portfolio website to showcase my projects and skills',
      bulletPoints: [],
      url: 'https://github.com/johndoe/portfolio'
    }
  ],
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
        experience: [...(state.experience || []), action.payload]
      };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: (state.experience || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: (state.experience || []).filter(item => item.id !== action.payload)
      };
    case 'ADD_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: (state.experience || []).map(item =>
          item.id === action.payload.experienceId
            ? { ...item, bulletPoints: [...(item.bulletPoints || []), action.payload.bullet] }
            : item
        )
      };
    case 'UPDATE_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: (state.experience || []).map(item =>
          item.id === action.payload.experienceId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).map((bullet, index) =>
                index === action.payload.index
                  ? action.payload.text
                  : bullet
              )
            }
            : item
        )
      };
    case 'REMOVE_EXPERIENCE_BULLET':
      return {
        ...state,
        experience: (state.experience || []).map(item =>
          item.id === action.payload.experienceId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).filter((_, index) =>
                index !== action.payload.index
              )
            }
            : item
        )
      };
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [...(state.education || []), action.payload]
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: (state.education || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: (state.education || []).filter(item => item.id !== action.payload)
      };
    case 'ADD_EDUCATION_BULLET':
      return {
        ...state,
        education: (state.education || []).map(item =>
          item.id === action.payload.educationId
            ? { ...item, bulletPoints: [...(item.bulletPoints || []), action.payload.bullet] }
            : item
        )
      };
    case 'UPDATE_EDUCATION_BULLET':
      return {
        ...state,
        education: (state.education || []).map(item =>
          item.id === action.payload.educationId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).map((bullet, index) =>
                index === action.payload.index
                  ? action.payload.text
                  : bullet
              )
            }
            : item
        )
      };
    case 'REMOVE_EDUCATION_BULLET':
      return {
        ...state,
        education: (state.education || []).map(item =>
          item.id === action.payload.educationId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).filter((_, index) =>
                index !== action.payload.index
              )
            }
            : item
        )
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...(state.skills || []), action.payload]
      };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: (state.skills || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: (state.skills || []).filter(item => item.id !== action.payload)
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...(state.projects || []), action.payload]
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: (state.projects || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: (state.projects || []).filter(item => item.id !== action.payload)
      };
    case 'ADD_PROJECT_BULLET':
      return {
        ...state,
        projects: (state.projects || []).map(item =>
          item.id === action.payload.projectId
            ? { ...item, bulletPoints: [...(item.bulletPoints || []), action.payload.bullet] }
            : item
        )
      };
    case 'UPDATE_PROJECT_BULLET':
      return {
        ...state,
        projects: (state.projects || []).map(item =>
          item.id === action.payload.projectId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).map((bullet, index) =>
                index === action.payload.index
                  ? action.payload.text
                  : bullet
              )
            }
            : item
        )
      };
    case 'REMOVE_PROJECT_BULLET':
      return {
        ...state,
        projects: (state.projects || []).map(item =>
          item.id === action.payload.projectId
            ? {
              ...item,
              bulletPoints: (item.bulletPoints || []).filter((_, index) =>
                index !== action.payload.index
              )
            }
            : item
        )
      };
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        certifications: [...(state.certifications || []), action.payload]
      };
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: (state.certifications || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        certifications: (state.certifications || []).filter(item => item.id !== action.payload)
      };
    case 'ADD_REFERENCE':
      return {
        ...state,
        references: (state.references || []).concat(action.payload)
      };
    case 'UPDATE_REFERENCE':
      return {
        ...state,
        references: (state.references || []).map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'REMOVE_REFERENCE':
      return {
        ...state,
        references: (state.references || []).filter(item => item.id !== action.payload)
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
      return blankResumeData;
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
  const data = process.env.NODE_ENV === "development" ? initialResumeData : blankResumeData;
  const [state, dispatch] = useReducer(resumeReducer, data);
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