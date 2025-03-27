"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Trash2, PlusCircle, X, BadgeCheck } from "lucide-react";
import { User, Skill } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileSection } from "@/app/(authenticated)/profile/ProfileSection";

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

  const isEmpty = optimisticSkills.length === 0;

  return (
    <ProfileSection
      title="Skills"
      icon={<BadgeCheck className="h-5 w-5" />}
      isEmpty={isEmpty}
      emptyStateMessage="Add skills to showcase your expertise."
      onAdd={() => {}} // Always show skills input
    >
      <div className="space-y-5">
        {/* Add Skill Input */}
        <div className="flex gap-2 relative">
          <Input
            placeholder="Add a new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isPending}
            className="pr-10"
          />
          {newSkill && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-12 top-0 h-full opacity-70 hover:opacity-100"
              onClick={() => setNewSkill("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={handleAddSkill}
            disabled={isPending || !newSkill.trim()}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>

        {/* Skills List */}
        {!isEmpty && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-300">
            {optimisticSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-primary/10 text-primary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-2 group border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <span className="font-medium">{skill.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 rounded-full bg-background/50 text-muted-foreground opacity-60 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveSkill(skill.id)}
                  disabled={isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileSection>
  );
} 