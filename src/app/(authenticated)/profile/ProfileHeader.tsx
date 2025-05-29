"use client";

import { useState, useTransition, useOptimistic, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/FormField";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type User, JobRole } from "@prisma/client";
import {
  Edit,
  MapPin,
  Mail,
  Github,
  Globe,
  Linkedin,
  Loader2,
  X,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrefixedInput } from "@/components/ui/prefix-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListContentEditor } from "@/components/resume-editor/components/ListContentEditor";

const JOB_ROLES = Object.entries(JobRole).map(([key, value]) => ({
  label: key
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
  value,
}));

interface ProfileFormData {
  name: string;
  role: JobRole;
  location: string;
  email: string;
  summary: string;
  highlights: string[];
  githubUsername: string;
  website: string;
  linkedinUsername: string;
}

interface ProfileHeaderProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => Promise<User>;
}

const ProfileEditDialog = ({
  open,
  onOpenChange,
  formData,
  onFieldChange,
  onHighlightsChange,
  onSave,
  isPending,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ProfileFormData;
  onFieldChange: (field: keyof ProfileFormData, value: string) => void;
  onHighlightsChange: (highlights: string[]) => void;
  onSave: () => void;
  isPending: boolean;
  user: User;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[575px] p-6 border-primary/20 overflow-y-auto max-h-[90vh]">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-xl font-semibold">
          Edit Profile
        </DialogTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-primary/70" />
          <span>{user.email}</span>
        </div>
      </DialogHeader>

      <Separator className="my-4" />

      <div className="grid gap-5 py-2">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Name"
              value={formData.name}
              onChange={(value) => onFieldChange("name", value)}
              required
              placeholder="Enter your full name"
            />
            <SearchableSelect
              label="Job Role"
              options={JOB_ROLES}
              value={formData.role}
              onValueChange={(value) => onFieldChange("role", value)}
              placeholder="Select a job role"
            />
          </div>
          <InputField
            label="Location"
            value={formData.location}
            onChange={(value) => onFieldChange("location", value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            Professional Summary
          </Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => onFieldChange("summary", e.target.value)}
            placeholder="Write a brief summary about your professional experience, skills, and career goals..."
            className="min-h-[120px] resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Career Highlights
          </Label>
          <ListContentEditor
            bulletPoints={formData.highlights}
            onAdd={(highlight) => onHighlightsChange([...formData.highlights, highlight])}
            onUpdate={(index, text) => {
              const updated = [...formData.highlights];
              updated[index] = text;
              onHighlightsChange(updated);
            }}
            onRemove={(index) => {
              const updated = formData.highlights.filter((_, i) => i !== index);
              onHighlightsChange(updated);
            }}
            onReorder={onHighlightsChange}
            bulletPlaceholder="Add a career highlight or achievement"
            addButtonText="Add Highlight"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Social Profiles</h3>
          <div className="grid gap-4">
            <PrefixedInput
              icon={<Github className="h-5 w-5" />}
              prefix="github.com/"
              value={formData.githubUsername}
              onChange={(value) => onFieldChange("githubUsername", value)}
              placeholder="username"
            />
            <PrefixedInput
              icon={<Linkedin className="h-5 w-5" />}
              prefix="linkedin.com/in/"
              value={formData.linkedinUsername}
              onChange={(value) => onFieldChange("linkedinUsername", value)}
              placeholder="username"
            />
            <PrefixedInput
              icon={<Globe className="h-5 w-5" />}
              prefix="https://"
              value={formData.website}
              onChange={(value) => onFieldChange("website", value)}
              placeholder="website"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 mt-6">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function ProfileHeader({ user, onSave }: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [optimisticUser, updateOptimisticUser] = useOptimistic<
    User,
    Partial<User>
  >(user, (state, update) => ({
    ...state,
    ...update,
  }));

  const extractUsername = (url: string, domain: string) => {
    if (!url) return "";
    const pattern = new RegExp(
      `(?:https?:\\/\\/(?:www\\.)?)?${domain}\\.com\\/(?:in\\/)?([^/?#]+)`
    );
    const match = url.match(pattern);
    if (match && match[1]) return match[1];

    const simpleExtract = url
      .replace(/^https?:\/\//, "")
      .replace(`www.${domain}.com/`, "")
      .replace(`${domain}.com/`, "");
    return simpleExtract.split("/")[0];
  };

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || "",
    role: user.role,
    location: user.location || "",
    email: user.email || "",
    summary: user.summary || "",
    highlights: user.highlights || [],
    githubUsername: extractUsername(user.github || "", "github"),
    website: user.website || "",
    linkedinUsername: extractUsername(user.linkedin || "", "linkedin"),
  });

  useEffect(() => {
    if (!editing) {
      setFormData({
        name: user.name || "",
        role: user.role,
        location: user.location || "",
        email: user.email || "",
        summary: user.summary || "",
        highlights: user.highlights || [],
        githubUsername: extractUsername(user.github || "", "github"),
        website: user.website || "",
        linkedinUsername: extractUsername(user.linkedin || "", "linkedin"),
      });
    }
  }, [user, editing]);

  const formatUrl = (
    usernameOrUrl: string,
    basePrefix: string,
    domain: string
  ) => {
    if (!usernameOrUrl) return "";
    if (
      usernameOrUrl.startsWith("http://") ||
      usernameOrUrl.startsWith("https://")
    ) {
      return usernameOrUrl;
    }
    if (!domain && usernameOrUrl.includes(".")) {
      return `${basePrefix}${usernameOrUrl}`;
    }
    if (domain && !usernameOrUrl.includes(domain)) {
      return `${basePrefix}${usernameOrUrl}`;
    }
    if (domain && usernameOrUrl.includes(domain)) {
      return `https://${usernameOrUrl.replace(/^https?:\/\//, "")}`;
    }
    return usernameOrUrl;
  };

  const handleSave = () => {
    const updatedFields: Partial<User> = {
      name: formData.name,
      role: formData.role,
      location: formData.location,
      summary: formData.summary,
      highlights: formData.highlights,
      github: formatUrl(
        formData.githubUsername,
        "https://github.com/",
        "github"
      ),
      website: formatUrl(formData.website, "https://", ""),
      linkedin: formatUrl(
        formData.linkedinUsername,
        "https://www.linkedin.com/in/",
        "linkedin"
      ),
    };

    updateOptimisticUser(updatedFields);

    startTransition(async () => {
      try {
        await onSave(updatedFields);
        setEditing(false);
        toast({
          title: "Profile updated",
          description:
            "Your profile information has been updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update profile:", error);
        updateOptimisticUser(user);
        toast({
          title: "Update failed",
          description:
            "There was a problem updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleFieldChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHighlightsChange = (highlights: string[]) => {
    setFormData((prev) => ({ ...prev, highlights }));
  };

  const getJobRoleLabel = (roleValue: JobRole) => {
    return (
      JOB_ROLES.find((role) => role.value === roleValue)?.label || roleValue
    );
  };

  const socialLinks = [
    {
      url: optimisticUser.github,
      icon: <Github className="h-5 w-5" />,
      label: "GitHub Profile",
    },
    {
      url: optimisticUser.website,
      icon: <Globe className="h-5 w-5" />,
      label: "Personal Website",
    },
    {
      url: optimisticUser.linkedin,
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn Profile",
    },
  ];

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-medium text-primary">
                {optimisticUser?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{optimisticUser?.name}</h1>
              {optimisticUser.role && (
                <div className="text-muted-foreground">
                  {getJobRoleLabel(optimisticUser.role)}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditing(true)}
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
        </div>

        {optimisticUser.summary && (
          <p className="text-muted-foreground mb-4">{optimisticUser.summary}</p>
        )}

        {optimisticUser.highlights && optimisticUser.highlights.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Career Highlights</h3>
            <ul className="space-y-1">
              {optimisticUser.highlights.map((highlight, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {optimisticUser?.location && (
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {optimisticUser.location}
            </Badge>
          )}

          {optimisticUser?.email && (
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {optimisticUser.email}
            </Badge>
          )}

          <div className="flex gap-3 items-center">
            {socialLinks
              .filter((link) => link.url)
              .map((link, index) => (
                <a
                  key={index}
                  href={link.url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 w-10 bg-primary/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
          </div>
        </div>
      </CardContent>

      <ProfileEditDialog
        open={editing}
        onOpenChange={setEditing}
        formData={formData}
        onFieldChange={handleFieldChange}
        onHighlightsChange={handleHighlightsChange}
        onSave={handleSave}
        isPending={isPending}
        user={user}
      />
    </Card>
  );
}
