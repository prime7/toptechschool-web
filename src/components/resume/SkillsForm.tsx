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
      <h2>Professional Skills</h2>
      <div>
        <Label>Add Skill</Label>
        <Input
          type="text"
          placeholder="type here"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="border px-1"
        />
        <Button type="button" onClick={addSkill}>
          Add
        </Button>
      </div>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsForm;
