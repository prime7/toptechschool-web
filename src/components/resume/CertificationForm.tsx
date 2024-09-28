"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface CertificationInfo {
  title: string;
  year: string;
}

const CertificationForm = () => {
  const [certificationList, setCertificationList] = useState<
    CertificationInfo[]
  >([{ title: "", year: "" }]);

  // Function to add a new certification entry
  const handleAddCertification = () => {
    setCertificationList([...certificationList, { title: "", year: "" }]);
  };

  // Function to handle field changes
  const handleChange = (
    index: number,
    field: keyof CertificationInfo,
    value: string
  ) => {
    const updatedCertificationList = [...certificationList];
    updatedCertificationList[index] = {
      ...updatedCertificationList[index],
      [field]: value,
    };
    setCertificationList(updatedCertificationList);
  };

  // Function to remove a certification entry
  const handleDeleteCertification = (index: number) => {
    const updatedCertificationList = certificationList.filter(
      (_, i) => i !== index
    );
    setCertificationList(updatedCertificationList);
  };

  return (
    <section className="certifications py-2">
      <h2 className="text-lg font-semibold">Certifications</h2>

      {certificationList.map((certification, index) => (
        <div
          key={index}
          className="mb-4 border dark:border-gray-600 p-2 rounded-md"
        >
          <div className="mb-2">
            <Label className="pr-2">Course Title</Label>
            <Input
              type="text"
              required
              placeholder="Enter your course title"
              className="border px-1 w-full"
              value={certification.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label>Year of Completion</Label>
            <Input
              type="date"
              required
              value={certification.year}
              onChange={(e) => handleChange(index, "year", e.target.value)}
              className="border px-1 w-full"
            />
          </div>

          {/* Delete Button */}
          {certificationList.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteCertification(index)}
            >
              Delete Certification
            </Button>
          )}
        </div>
      ))}

      {/* Add Another Certification Button */}
      <Button onClick={handleAddCertification}>
        Add Another Certification
      </Button>
    </section>
  );
};

export default CertificationForm;
