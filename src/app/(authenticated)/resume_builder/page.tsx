import ContactInfoForm from "@/components/resume/ContactInfoForm";
import EducationForm from "@/components/resume/EducationForm";
import PersonalDetailsForm from "@/components/resume/PersonalDetailsForm";
import SkillsForm from "@/components/resume/SkillsForm";
import WorkExperienceForm from "@/components/resume/WorkExperienceForm";
import React from "react";

export default function page() {
  return (
    <div>
      <h1 className="text-center text-2xl py-20">Create your resume</h1>
      <form action="">
        <PersonalDetailsForm />
        <ContactInfoForm />
        <EducationForm />
        <WorkExperienceForm />
        <SkillsForm />
      </form>
    </div>
  );
}
