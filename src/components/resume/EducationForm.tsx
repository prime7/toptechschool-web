"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface EducationInfo {
  institutionName: string;
  degree: string;
  startYear: string;
  endYear: string;
}

const EducationForm = () => {
  const [educationList, setEducationList] = useState<EducationInfo[]>([
    { institutionName: "", degree: "", startYear: "", endYear: "" },
  ]);

  // Function to add a new education entry
  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      { institutionName: "", degree: "", startYear: "", endYear: "" },
    ]);
  };

  // Function to handle field changes
  const handleChange = (
    index: number,
    field: keyof EducationInfo,
    value: string
  ) => {
    const updatedEducationList = [...educationList];
    updatedEducationList[index] = {
      ...updatedEducationList[index],
      [field]: value,
    };
    setEducationList(updatedEducationList);
  };

  // Function to remove an education entry
  const handleDeleteEducation = (index: number) => {
    const updatedEducationList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedEducationList);
  };

  return (
    <section className="education py-2">
      <h2 className="text-lg font-semibold">Education</h2>

      {educationList.map((education, index) => (
        <div
          key={index}
          className="mb-4 border dark:border-gray-600 p-2 rounded-md"
        >
          <div className="mb-2">
            <Label className="pr-2">Institution Name</Label>
            <Input
              type="text"
              name={`institutionName-${index}`}
              required
              placeholder="Enter your institute name"
              className="border px-1 w-full"
              value={education.institutionName}
              onChange={(e) =>
                handleChange(index, "institutionName", e.target.value)
              }
            />
          </div>
          <div className="mb-2">
            <Label>Degree</Label>
            <Input
              type="text"
              name={`degree-${index}`}
              required
              value={education.degree}
              onChange={(e) => handleChange(index, "degree", e.target.value)}
              className="border px-1 w-full"
            />
          </div>
          <div className="mb-2">
            <Label>Start Year</Label>
            <Input
              type="date"
              name={`startYear-${index}`}
              value={education.startYear}
              onChange={(e) => handleChange(index, "startYear", e.target.value)}
              className="border px-1 w-full"
            />
          </div>
          <div className="mb-2">
            <Label>End Year</Label>
            <Input
              type="date"
              name={`endYear-${index}`}
              value={education.endYear}
              onChange={(e) => handleChange(index, "endYear", e.target.value)}
              className="border px-1 w-full"
            />
          </div>

          {/* Delete Button */}
          {educationList.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteEducation(index)}
            >
              Delete Education
            </Button>
          )}
        </div>
      ))}

      {/* Add Another Education Button */}
      <Button onClick={handleAddEducation}>Add Another Education</Button>
    </section>
  );
};

export default EducationForm;
