"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Trash2, PlusCircle } from "lucide-react";
import { User, Skill } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileSkillsProps {
  user: User & { skills: Skill[] };
  onSave: (data: Partial<User & { skills: Omit<Skill, "id">[] }>) => Promise<User>;
}

export default function ProfileSkills({ user, onSave }: ProfileSkillsProps) {
  const [isPending, startTransition] = useTransition();
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();
  
  const [optimisticSkills, updateOptimisticSkills] = useOptimistic(
    user.skills,
    (state, newSkills: Skill[]) => newSkills
  );

  const [skills, setSkills] = useState<Skill[]>(user.skills);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast({
        title: "Invalid skill",
        description: "Please enter a skill name.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates (case-insensitive)
    if (skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      toast({
        title: "Duplicate skill",
        description: "This skill already exists in your list.",
        variant: "destructive",
      });
      return;
    }

    const skillToAdd: Skill = {
      id: `temp-${Date.now()}`,
      name: newSkill.trim(),
      userId: user.id,
    };

    const updatedSkills = [...skills, skillToAdd];
    setSkills(updatedSkills);
    updateOptimisticSkills(updatedSkills);

    // Save immediately
    startTransition(async () => {
      try {
        const formattedSkills = updatedSkills.map(({ id, ...skill }) => ({
          name: skill.name,
          userId: user.id,
        }));

        await onSave({ skills: formattedSkills });
        
        toast({
          title: "Skills updated",
          description: "New skill has been added successfully.",
        });

        setNewSkill("");
      } catch (error) {
        console.error("Failed to add skill:", error);
        toast({
          title: "Update failed",
          description: "There was a problem adding your skill. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter(s => s.id !== skillId);
    setSkills(updatedSkills);
    updateOptimisticSkills(updatedSkills);

    startTransition(async () => {
      try {
        const formattedSkills = updatedSkills.map(({ id, ...skill }) => ({
          name: skill.name,
          userId: user.id,
        }));

        await onSave({ skills: formattedSkills });
        
        toast({
          title: "Skills updated",
          description: "Skill has been removed successfully.",
        });
      } catch (error) {
        console.error("Failed to remove skill:", error);
        toast({
          title: "Update failed",
          description: "There was a problem removing your skill. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Skills</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Add Skill Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPending}
          />
          <Button 
            onClick={handleAddSkill}
            disabled={isPending}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {optimisticSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-muted text-muted-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-2 group"
            >
              {skill.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveSkill(skill.id)}
                disabled={isPending}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 