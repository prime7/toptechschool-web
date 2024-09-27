"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  jobDescription: string;
}

const WorkExperienceForm = () => {
  const [workExperienceList, setWorkExperienceList] = useState<
    WorkExperience[]
  >([
    {
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      jobDescription: "",
    },
  ]);

  // Function to add a new work experience entry
  const handleAddWorkExperience = () => {
    setWorkExperienceList([
      ...workExperienceList,
      {
        jobTitle: "",
        companyName: "",
        startDate: "",
        endDate: "",
        jobDescription: "",
      },
    ]);
  };

  // Function to handle field changes
  const handleChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedWorkExperienceList = [...workExperienceList];
    updatedWorkExperienceList[index] = {
      ...updatedWorkExperienceList[index],
      [field]: value,
    };
    setWorkExperienceList(updatedWorkExperienceList);
  };

  // Function to remove a work experience entry
  const handleDeleteWorkExperience = (index: number) => {
    const updatedWorkExperienceList = workExperienceList.filter(
      (_, i) => i !== index
    );
    setWorkExperienceList(updatedWorkExperienceList);
  };

  return (
    <section className="work-experience py-2">
      <h2 className="text-lg font-semibold">Work Experience</h2>

      <div className="mb-4 border dark:border-gray-600 rounded-md">
        {workExperienceList.map((workExperience, index) => (
          <div key={index} className="mb-4  p-2 ">
            <div className="mb-2">
              <Label className="pr-2">Job Title</Label>
              <Input
                type="text"
                name={`jobTitle-${index}`}
                required
                placeholder="Enter job title"
                className="border px-1 w-full"
                value={workExperience.jobTitle}
                onChange={(e) =>
                  handleChange(index, "jobTitle", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <Label className="pr-2">Company Name</Label>
              <Input
                type="text"
                name={`companyName-${index}`}
                required
                placeholder="Enter company name"
                className="border px-1 w-full"
                value={workExperience.companyName}
                onChange={(e) =>
                  handleChange(index, "companyName", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                name={`startDate-${index}`}
                value={workExperience.startDate}
                onChange={(e) =>
                  handleChange(index, "startDate", e.target.value)
                }
                className="border px-1 w-full"
              />
            </div>
            <div className="mb-2">
              <Label>End Date</Label>
              <Input
                type="date"
                name={`endDate-${index}`}
                value={workExperience.endDate}
                onChange={(e) => handleChange(index, "endDate", e.target.value)}
                className="border px-1 w-full"
              />
            </div>
            <div>
              <Label>Job Description</Label>
              <Textarea
                name={`jobDescription-${index}`}
                value={workExperience.jobDescription}
                onChange={(e) =>
                  handleChange(index, "jobDescription", e.target.value)
                }
                className="border px-1 w-full"
              />
            </div>

            {/* Delete Button */}
            {workExperienceList.length > 1 && (
              <Button
                variant="destructive"
                className="mt-2"
                onClick={() => handleDeleteWorkExperience(index)}
              >
                Delete Work Experience
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add Another Work Experience Button */}
      <Button className="mb-2" onClick={handleAddWorkExperience}>
        Add Another Work Experience
      </Button>
    </section>
  );
};

export default WorkExperienceForm;
