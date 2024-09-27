"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SkillsForm = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <section className="skills">
      <h2 className="text-lg font-semibold">Professional Skills</h2>
      <div className="mb-4 border dark:border-gray-600 px-2 rounded-md">
        <div className="py-2">
          <Label>Add Skill</Label>
          <Input
            type="text"
            placeholder="type here"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="border px-1"
          />
          <Button onClick={addSkill}>Add</Button>
        </div>
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SkillsForm;
