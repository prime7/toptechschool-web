import React from "react";
import { useResume } from "../context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobRole } from "../constants";

const JOB_ROLES = Object.entries(JobRole).map(([key, value]) => ({
  label: key
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
  value,
}));

const PersonalInfoSection: React.FC = () => {
  const { state, dispatch, exportUtils } = useResume();
  const { personal } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_PERSONAL",
      payload: { [name]: value },
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    dispatch({
      type: "UPDATE_PERSONAL",
      payload: { [name]: value },
    });
  };

  const handleExport = () => {
    exportUtils.exportSection('personal');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Button onClick={handleExport} size="sm">Export</Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={personal.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="profession">Job Title</Label>
            <Select value={personal.profession} onValueChange={(value) => handleSelectChange('profession', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job title" />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={personal.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={personal.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={personal.location}
              onChange={handleChange}
              placeholder="City, State"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Online Presence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={personal.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                value={personal.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                type="url"
                value={personal.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
