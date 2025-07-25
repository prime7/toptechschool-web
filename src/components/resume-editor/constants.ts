import { ResumeStyle } from "./types";

export const defaultStyle: ResumeStyle = {
  pagePaddingX: 24,
  pagePaddingY: 24,
  fontFamily: "Helvetica",
  fontSize: 11,
  accentColor: '#000',
  sectionSpacing: 8,
  lineHeight: 1.2,
  showSectionHorizontalRule: true,
};

export const JobRole = {
  SOFTWARE_ENGINEER: "Software Engineer",
  FRONTEND_DEVELOPER: "Frontend Developer",
  BACKEND_DEVELOPER: "Backend Developer",
  FULLSTACK_DEVELOPER: "Fullstack Developer",
  DEVOPS_ENGINEER: "DevOps Engineer",
  QA_ENGINEER: "QA Engineer",
  DATA_SCIENTIST: "Data Scientist",
  DATA_ENGINEER: "Data Engineer",
  MACHINE_LEARNING_ENGINEER: "Machine Learning Engineer",
  PRODUCT_MANAGER: "Product Manager",
  PROJECT_MANAGER: "Project Manager",
  SCRUM_MASTER: "Scrum Master",
  UI_UX_DESIGNER: "UI/UX Designer",
  SYSTEM_ADMINISTRATOR: "System Administrator",
  SECURITY_ENGINEER: "Security Engineer",
  DATABASE_ADMINISTRATOR: "Database Administrator",
} as const;