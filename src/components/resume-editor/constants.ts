import { ResumeStyle } from "./types";

export const defaultStyle: ResumeStyle = {
  fontFamily: 'inter',
  fontSize: 10.6,
  accentColor: '#000',
  sectionSpacing: 18,
  lineHeight: 1.3,
  showSectionHorizontalRule: false,
  personalSectionAlignment: 'center',
  sectionHeaderAlignment: 'left'
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