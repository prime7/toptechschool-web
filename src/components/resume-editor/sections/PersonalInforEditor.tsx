import React from 'react';
import { useResume } from '../context/ResumeContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const { personal } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_PERSONAL',
      payload: { [name]: value }
    });
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add your personal and contact information.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
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
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={personal.title}
              onChange={handleChange}
            />
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
      </CardContent>
    </Card>
  );
};

export default PersonalInfoEditor;
