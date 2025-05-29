"use client";

import { useState, useTransition, useOptimistic, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/FormField";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
          <ListContentEditor
            bulletPoints={formData.highlights}
            onAdd={(highlight) =>
              onHighlightsChange([...formData.highlights, highlight])
            }
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
            description={formData.summary}
            onDescriptionChange={(summary) => onFieldChange("summary", summary)}
            descriptionLabel="Professional Summary"
            descriptionPlaceholder="Write a brief summary about your professional experience, skills, and career goals..."
            showDescription={true}
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
      icon: <Github className="h-4 w-4" />,
      label: "GitHub",
      username: extractUsername(optimisticUser.github || "", "github"),
    },
    {
      url: optimisticUser.website,
      icon: <Globe className="h-4 w-4" />,
      label: "Website",
      username: optimisticUser.website
        ?.replace(/^https?:\/\//, "")
        .replace(/\/$/, ""),
    },
    {
      url: optimisticUser.linkedin,
      icon: <Linkedin className="h-4 w-4" />,
      label: "LinkedIn",
      username: extractUsername(optimisticUser.linkedin || "", "linkedin"),
    },
  ].filter((link) => link.url);

  return (
    <div className="w-full sticky top-4">
      <Card className="shadow-sm bg-muted/30 rounded-lg border">
        <CardContent className="p-4">
          {/* Edit Button */}
          <div className="flex justify-end mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <Edit className="h-3 w-3 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
          </div>

          <div className="space-y-4">
            {/* Avatar and Basic Info */}
            <div className="text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-medium text-primary">
                  {optimisticUser?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold leading-tight">
                  {optimisticUser?.name || "Name not set"}
                </h1>
                {optimisticUser.role && (
                  <p className="text-xs text-muted-foreground">
                    {getJobRoleLabel(optimisticUser.role)}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-center">
              {optimisticUser?.location && (
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{optimisticUser.location}</span>
                </div>
              )}
              {optimisticUser?.email && (
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{optimisticUser.email}</span>
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-center text-muted-foreground">
                  Connect
                </h3>
                <div className="flex items-center justify-center gap-2">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200 group"
                    >
                      <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {link.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {(optimisticUser.summary ||
              (optimisticUser.highlights &&
                optimisticUser.highlights.length > 0)) && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                {optimisticUser.summary && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {optimisticUser.summary}
                  </p>
                )}
                {optimisticUser.highlights &&
                  optimisticUser.highlights.length > 0 && (
                    <div className="space-y-1">
                      {optimisticUser.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-xs"
                        >
                          <div className="text-primary mt-0.5 text-xs flex-shrink-0">
                            •
                          </div>
                          <span className="text-muted-foreground leading-relaxed">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
