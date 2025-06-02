import { LocationType } from "@prisma/client";

export type SectionType =
  | "personal"
  | "summary"
  | "work"
  | "education"
  | "projects";

export interface ListItem {
  id: string;
  text: string;
}
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  profession: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkItem {
  id: string;
  company: string;
  position: string | null;
  location: LocationType | null;
  startDate: string;
  endDate?: string;
  description?: string;
  points: string[];
  displayOrder: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
  points: string[];
  displayOrder: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  points: string[];
  url?: string;
  displayOrder: number;
}

export interface ResumeStyle {
  fontFamily: string;
  fontSize: number;
  accentColor: string;
  sectionSpacing: number;
  lineHeight: number;
  showSectionHorizontalRule: boolean;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary?: string;
  summaryHighlights?: string[];
  work?: WorkItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  activeSections: SectionType[];
  style: ResumeStyle;
}

export type ResumeAction =
  | { type: "UPDATE_PERSONAL"; payload: Partial<PersonalInfo> }
  | { type: "UPDATE_SUMMARY"; payload: string }
  | { type: "UPDATE_SUMMARY_HIGHLIGHTS"; payload: string[] }
  | { type: "ADD_EXPERIENCE"; payload: WorkItem }
  | {
      type: "UPDATE_EXPERIENCE";
      payload: { id: string; data: Partial<WorkItem> };
    }
  | { type: "REMOVE_EXPERIENCE"; payload: string }
  | { type: "REORDER_EXPERIENCE"; payload: WorkItem[] }
  | {
      type: "ADD_EXPERIENCE_BULLET";
      payload: { experienceId: string; bullet: string };
    }
  | {
      type: "UPDATE_EXPERIENCE_BULLET";
      payload: { experienceId: string; index: number; text: string };
    }
  | {
      type: "REMOVE_EXPERIENCE_BULLET";
      payload: { experienceId: string; index: number };
    }
  | { type: "ADD_EDUCATION"; payload: EducationItem }
  | {
      type: "UPDATE_EDUCATION";
      payload: { id: string; data: Partial<EducationItem> };
    }
  | { type: "REMOVE_EDUCATION"; payload: string }
  | {
      type: "ADD_EDUCATION_BULLET";
      payload: { educationId: string; bullet: string };
    }
  | {
      type: "UPDATE_EDUCATION_BULLET";
      payload: { educationId: string; index: number; text: string };
    }
  | {
      type: "REMOVE_EDUCATION_BULLET";
      payload: { educationId: string; index: number };
    }
  | { type: "ADD_PROJECT"; payload: ProjectItem }
  | {
      type: "UPDATE_PROJECT";
      payload: { id: string; data: Partial<ProjectItem> };
    }
  | { type: "REMOVE_PROJECT"; payload: string }
  | {
      type: "ADD_PROJECT_BULLET";
      payload: { projectId: string; bullet: string };
    }
  | {
      type: "UPDATE_PROJECT_BULLET";
      payload: { projectId: string; index: number; text: string };
    }
  | {
      type: "REMOVE_PROJECT_BULLET";
      payload: { projectId: string; index: number };
    }
  | { type: "REMOVE_LANGUAGE"; payload: string }
  | { type: "TOGGLE_SECTION"; payload: SectionType }
  | { type: "REORDER_SECTIONS"; payload: SectionType[] }
  | { type: "LOAD_RESUME"; payload: ResumeData }
  | { type: "RESET_RESUME" }
  | { type: "UPDATE_STYLE"; payload: Partial<ResumeStyle> }
  | { type: "RESET_STYLE" };
