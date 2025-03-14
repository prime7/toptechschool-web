"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Trash2, Github, Linkedin, Twitter, Globe, Edit, Save } from "lucide-react";
import { getInitialsFromName } from "@/lib/utils";
import { Platform, Skill } from "@prisma/client";

export default function Profile() {
  const [user, setUser] = useState({
    name: "John Doe",
    title: "Senior Software Engineer",
    bio: "Passionate software developer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies.",
    image: "",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
  });

  const [socialLinks, setSocialLinks] = useState([
    { platform: "github", url: "https://github.com/johndoe" },
    { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
    { platform: "twitter", url: "https://twitter.com/johndoe" },
  ]);

  const [newSocialLink, setNewSocialLink] = useState({ platform: "github", url: "" });

  const [workExperience, setWorkExperience] = useState([
    {
      company: "Tech Solutions Inc.",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "Present",
      description: "Leading development of cloud-based applications using React and Node.js."
    },
    {
      company: "Digital Innovations",
      position: "Software Developer",
      startDate: "2017-06",
      endDate: "2019-12",
      description: "Developed and maintained web applications for enterprise clients."
    }
  ]);

  const [education, setEducation] = useState([
    {
      institution: "University of Technology",
      degree: "Master of Computer Science",
      startDate: "2015-09",
      endDate: "2017-05",
    },
    {
      institution: "State University",
      degree: "Bachelor of Science in Software Engineering",
      startDate: "2011-09",
      endDate: "2015-05",
    }
  ]);

  const [skills, setSkills] = useState([
    "JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "GraphQL", "MongoDB"
  ]);
  
  const [newSkill, setNewSkill] = useState("");

  const [editingSection, setEditingSection] = useState("");

  const addSocialLink = () => {
    if (newSocialLink.url) {
      setSocialLinks([...socialLinks, newSocialLink]);
      setNewSocialLink({ platform: "github", url: "" });
    }
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: Skill) => {
    setSkills(skills.filter(s => s.id !== skill.id));
  };

  const getSocialIcon = (platform: Platform ) => {
    switch (platform) {
      case Platform.GITHUB: return <Github className="h-5 w-5" />;
      case Platform.LINKEDIN: return <Linkedin className="h-5 w-5" />;
      case Platform.TWITTER: return <Twitter className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid gap-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-xl">{getInitialsFromName(user.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {editingSection !== "basic" && (
                <Button variant="ghost" size="icon" onClick={() => setEditingSection("basic")}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xl text-muted-foreground">{user.title}</p>
            <p className="mt-1">{user.location}</p>
            <p className="mt-1 text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {editingSection === "basic" && (
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Edit Basic Information</h2>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={user.name} 
                  onChange={(e) => setUser({...user, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={user.title} 
                  onChange={(e) => setUser({...user, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input 
                  value={user.location} 
                  onChange={(e) => setUser({...user, location: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={user.email} 
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection("")}>Cancel</Button>
                <Button onClick={() => setEditingSection("")}>Save</Button>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">About</h2>
            {editingSection !== "about" && (
              <Button variant="ghost" size="icon" onClick={() => setEditingSection("about")}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {editingSection === "about" ? (
            <div>
              <Textarea 
                value={user.bio} 
                onChange={(e) => setUser({...user, bio: e.target.value})}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditingSection("")}>Cancel</Button>
                <Button onClick={() => setEditingSection("")}>Save</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">{user.bio}</p>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Social Links</h2>
            {editingSection !== "social" && (
              <Button variant="ghost" size="icon" onClick={() => setEditingSection("social")}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                {getSocialIcon(link.platform)}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1">
                  {link.url}
                </a>
                {editingSection === "social" && (
                  <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            
            {editingSection === "social" && (
              <div className="mt-4 grid gap-4">
                <div className="flex gap-2">
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink({...newSocialLink, platform: e.target.value})}
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="website">Website</option>
                  </select>
                  <Input 
                    placeholder="URL" 
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                  />
                  <Button onClick={addSocialLink}>Add</Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingSection("")}>Cancel</Button>
                  <Button onClick={() => setEditingSection("")}>Save</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          
          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{job.position}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.startDate} - {job.endDate}</p>
                <p className="mt-2">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            {editingSection !== "skills" && (
              <Button variant="ghost" size="icon" onClick={() => setEditingSection("skills")}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {skill}
                {editingSection === "skills" && (
                  <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {editingSection === "skills" && (
            <div className="mt-4 grid gap-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a skill" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection("")}>Cancel</Button>
                <Button onClick={() => setEditingSection("")}>Save</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}