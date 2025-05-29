import React, { createContext, useContext, useReducer } from "react";
import {
  ResumeData,
  ResumeAction,
  WorkItem,
  ProjectItem,
  SectionType,
} from "../types";
import { generateId } from "../utils";
import { defaultStyle } from "../constants";
import { Degree, LocationType } from "@prisma/client";
import { JobRole } from "../constants";

export const initialResumeData: ResumeData = {
  activeSections: ["personal", "summary", "work", "education"],
  personal: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    profession: "Senior Software Engineer",
    website: "https://johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
  summary:
    "Experienced software engineer with 8+ years of experience in building scalable web applications. Specialized in frontend development with React and TypeScript, with a strong focus on performance optimization and user experience.",
  summaryHighlights: [
    "8+ years of experience in full-stack development",
    "Led teams of 5+ developers on multiple projects",
    "Improved application performance by 40%",
    "Expert in React, TypeScript, and modern web technologies",
  ],
  work: [
    {
      id: generateId(),
      company: "Tech Company",
      position: JobRole.SOFTWARE_ENGINEER,
      location: LocationType.REMOTE,
      startDate: "2020-01",
      endDate: "2020-01",
      description:
        "Led development of web applications using modern technologies",
      points: [
        "Managed a team of 5 developers",
        "Implemented CI/CD pipelines",
        "Improved application performance by 40%",
        "Reduced deployment time by 60%",
        "Mentored junior developers",
      ],
      displayOrder: 0,
    },
    {
      id: generateId(),
      company: "Startup Inc",
      position: JobRole.FRONTEND_DEVELOPER,
      location: LocationType.REMOTE,
      startDate: "2018-03",
      endDate: "2019-12",
      description: "Developed responsive UIs using React and Redux",
      points: [
        "Integrated third-party APIs and services",
        "Optimized application load time by 30%",
        "Implemented automated testing suite",
      ],
      displayOrder: 1,
    },
  ],
  education: [
    {
      id: generateId(),
      institution: "University of Technology",
      degree: Degree.BACHELORS,
      startDate: "2014-09",
      endDate: "2018-06",
      description:
        "Graduated with honors. Specialized in software engineering and data structures.",
      points: [
        "Data Structures and Algorithms",
        "Software Engineering",
        "Database Systems",
      ],
      displayOrder: 0,
    },
    {
      id: generateId(),
      institution: "Tech Bootcamp",
      degree: Degree.BACHELORS,
      startDate: "2016-06",
      endDate: "2016-12",
      description:
        "Intensive 6-month bootcamp covering modern web development technologies and practices.",
      points: ["Full Stack Web Development", "React"],
      displayOrder: 1,
    },
  ],
  projects: [
    {
      id: generateId(),
      name: "E-commerce Platform",
      description:
        "Developed a full-featured e-commerce platform using React, Node.js, and MongoDB.",
      points: [
        "User authentication",
        "Product catalog with search and filtering",
        "Shopping cart and checkout process",
        "Admin dashboard for managing products and orders",
      ],
      url: "https://github.com/johndoe/ecommerce",
      displayOrder: 0,
    },
    {
      id: generateId(),
      name: "Personal Portfolio",
      description:
        "Designed and developed a personal portfolio website to showcase my projects and skills",
      points: [],
      url: "https://github.com/johndoe/portfolio",
      displayOrder: 1,
    },
  ],
  style: defaultStyle,
};

export const blankResumeData: ResumeData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  summaryHighlights: [],
  work: [],
  education: [],
  projects: [],
  activeSections: ["personal", "summary", "work", "education"],
  style: defaultStyle,
};

interface SectionValidationRules {
  requiredFields: string[];
  fieldLabels: Record<string, string>;
}

const SECTION_VALIDATION_RULES: Record<SectionType, SectionValidationRules> = {
  personal: {
    requiredFields: ["fullName", "email"],
    fieldLabels: {
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      profession: "Job Title",
      website: "Website",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },
  summary: {
    requiredFields: ["summary"],
    fieldLabels: {
      summary: "Summary",
    },
  },
  work: {
    requiredFields: [],
    fieldLabels: {},
  },
  education: {
    requiredFields: [],
    fieldLabels: {},
  },
  projects: {
    requiredFields: [],
    fieldLabels: {},
  },
};

interface ExportUtilities {
  autoFillFromProfile: (section: SectionType, fields?: string[]) => void;
  exportSection: (section: SectionType) => void;
}

const ResumeContext = createContext<
  | {
      state: ResumeData;
      dispatch: React.Dispatch<ResumeAction>;
      userData?: ResumeData;
      exportUtils: ExportUtilities;
    }
  | undefined
>(undefined);

function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case "UPDATE_PERSONAL":
      return {
        ...state,
        personal: { ...state.personal, ...action.payload },
      };
    case "UPDATE_SUMMARY":
      return {
        ...state,
        summary: action.payload,
      };
    case "UPDATE_SUMMARY_HIGHLIGHTS":
      return {
        ...state,
        summaryHighlights: action.payload,
      };
    case "ADD_EXPERIENCE":
      return {
        ...state,
        work: [...(state.work || []), action.payload],
      };
    case "UPDATE_EXPERIENCE":
      return {
        ...state,
        work: (state.work || []).map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item
        ),
      };
    case "REMOVE_EXPERIENCE":
      return {
        ...state,
        work: (state.work || []).filter((item) => item.id !== action.payload),
      };
    case "ADD_EXPERIENCE_BULLET":
      return {
        ...state,
        work: (state.work || []).map((item) =>
          item.id === action.payload.experienceId
            ? {
                ...item,
                points: [...item.points, action.payload.bullet],
              }
            : item
        ),
      };
    case "UPDATE_EXPERIENCE_BULLET":
      return {
        ...state,
        work: (state.work || []).map((item: WorkItem) =>
          item.id === action.payload.experienceId
            ? {
                ...item,
                points: (item.points || []).map(
                  (bullet: string, index: number) =>
                    index === action.payload.index
                      ? action.payload.text
                      : bullet
                ),
              }
            : item
        ),
      };
    case "REMOVE_EXPERIENCE_BULLET":
      return {
        ...state,
        work: (state.work || []).map((item: WorkItem) =>
          item.id === action.payload.experienceId
            ? {
                ...item,
                points: (item.points || []).filter(
                  (_: string, index: number) => index !== action.payload.index
                ),
              }
            : item
        ),
      };
    case "ADD_EDUCATION":
      return {
        ...state,
        education: [...(state.education || []), action.payload],
      };
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: (state.education || []).map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item
        ),
      };
    case "REMOVE_EDUCATION":
      return {
        ...state,
        education: (state.education || []).filter(
          (item) => item.id !== action.payload
        ),
      };
    case "ADD_EDUCATION_BULLET":
      return {
        ...state,
        education: (state.education || []).map((item) =>
          item.id === action.payload.educationId
            ? {
                ...item,
                points: [...(item.points || []), action.payload.bullet],
              }
            : item
        ),
      };
    case "UPDATE_EDUCATION_BULLET":
      return {
        ...state,
        education: (state.education || []).map((item) =>
          item.id === action.payload.educationId
            ? {
                ...item,
                points: (item.points || []).map(
                  (bullet: string, index: number) =>
                    index === action.payload.index
                      ? action.payload.text
                      : bullet
                ),
              }
            : item
        ),
      };
    case "REMOVE_EDUCATION_BULLET":
      return {
        ...state,
        education: (state.education || []).map((item) =>
          item.id === action.payload.educationId
            ? {
                ...item,
                points: (item.points || []).filter(
                  (_: string, index: number) => index !== action.payload.index
                ),
              }
            : item
        ),
      };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...(state.projects || []), action.payload],
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: (state.projects || []).map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item
        ),
      };
    case "REMOVE_PROJECT":
      return {
        ...state,
        projects: (state.projects || []).filter(
          (item) => item.id !== action.payload
        ),
      };
    case "ADD_PROJECT_BULLET":
      return {
        ...state,
        projects: (state.projects || []).map((item: ProjectItem) =>
          item.id === action.payload.projectId
            ? {
                ...item,
                points: [...(item.points || []), action.payload.bullet],
              }
            : item
        ),
      };
    case "UPDATE_PROJECT_BULLET":
      return {
        ...state,
        projects: (state.projects || []).map((item: ProjectItem) =>
          item.id === action.payload.projectId
            ? {
                ...item,
                points: (item.points || []).map(
                  (bullet: string, index: number) =>
                    index === action.payload.index
                      ? action.payload.text
                      : bullet
                ),
              }
            : item
        ),
      };
    case "REMOVE_PROJECT_BULLET":
      return {
        ...state,
        projects: (state.projects || []).map((item: ProjectItem) =>
          item.id === action.payload.projectId
            ? {
                ...item,
                points: (item.points || []).filter(
                  (_: string, index: number) => index !== action.payload.index
                ),
              }
            : item
        ),
      };

    case "TOGGLE_SECTION":
      return {
        ...state,
        activeSections: state.activeSections.includes(action.payload)
          ? state.activeSections.filter((section) => section !== action.payload)
          : [...state.activeSections, action.payload],
      };
    case "REORDER_SECTIONS":
      return {
        ...state,
        activeSections: action.payload,
      };
    case "LOAD_RESUME":
      return action.payload;
    case "RESET_RESUME":
      return blankResumeData;
    case "UPDATE_STYLE":
      return {
        ...state,
        style: { ...state.style, ...action.payload },
      };
    case "RESET_STYLE":
      return {
        ...state,
        style: defaultStyle,
      };
    default:
      return state;
  }
}

export function ResumeProvider({
  children,
  initialState,
  userData,
}: {
  children: React.ReactNode;
  initialState: ResumeData;
  userData?: ResumeData;
}) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const autoFillFromProfile = (section: SectionType, fields?: string[]) => {
    if (!userData) return;

    if (section === "personal" && userData.personal) {
      const updateData: Record<string, string> = {};

      if (fields) {
        fields.forEach((field) => {
          const value =
            userData.personal[field as keyof typeof userData.personal];
          if (value) {
            updateData[field] = value;
          }
        });
      } else {
        const allPersonalFields = Object.keys(
          SECTION_VALIDATION_RULES.personal.fieldLabels
        );
        allPersonalFields.forEach((field) => {
          const value =
            userData.personal[field as keyof typeof userData.personal];
          if (value && !state.personal[field as keyof typeof state.personal]) {
            updateData[field] = value;
          }
        });
      }

      if (Object.keys(updateData).length > 0) {
        dispatch({
          type: "UPDATE_PERSONAL",
          payload: updateData,
        });
      }
    } else if (section === "summary" && userData.summary) {
      dispatch({
        type: "UPDATE_SUMMARY",
        payload: userData.summary,
      });
      if (userData.summaryHighlights) {
        dispatch({
          type: "UPDATE_SUMMARY_HIGHLIGHTS",
          payload: userData.summaryHighlights,
        });
      }
    } else if (section === "work" && userData.work && userData.work.length > 0) {
      userData.work.forEach((workItem) => {
        dispatch({
          type: "ADD_EXPERIENCE",
          payload: workItem,
        });
      });
    } else if (section === "education" && userData.education && userData.education.length > 0) {
      userData.education.forEach((educationItem) => {
        dispatch({
          type: "ADD_EDUCATION",
          payload: educationItem,
        });
      });
    } else if (section === "projects" && userData.projects && userData.projects.length > 0) {
      userData.projects.forEach((projectItem) => {
        dispatch({
          type: "ADD_PROJECT",
          payload: projectItem,
        });
      });
    }
  };

  const exportSection = (section: SectionType) => {
    autoFillFromProfile(section);
  };

  const exportUtils: ExportUtilities = {
    autoFillFromProfile,
    exportSection,
  };

  return (
    <ResumeContext.Provider value={{ state, dispatch, userData, exportUtils }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
