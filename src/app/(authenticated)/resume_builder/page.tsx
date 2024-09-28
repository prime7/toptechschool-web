import CertificationForm from "@/components/resume/CertificationForm";
import ContactInfoForm from "@/components/resume/ContactInfoForm";
import EducationForm from "@/components/resume/EducationForm";
import PersonalDetailsForm from "@/components/resume/PersonalDetailsForm";
import ProjectsForm from "@/components/resume/ProjectsForm";
import SkillsForm from "@/components/resume/SkillsForm";
import SummaryForm from "@/components/resume/SummaryForm";
import WorkExperienceForm from "@/components/resume/WorkExperienceForm";
import React from "react";

export default function page() {
  return (
    <div className="container mx-auto max-w-screen-lg ">
      <h1 className="text-center text-2xl py-5">Create your resume</h1>
      <form action="">
        <PersonalDetailsForm />
        <ContactInfoForm />
        <SummaryForm />
        <EducationForm />
        <SkillsForm />
        <WorkExperienceForm />
        <ProjectsForm />
        <CertificationForm />
      </form>
    </div>
  );
}
