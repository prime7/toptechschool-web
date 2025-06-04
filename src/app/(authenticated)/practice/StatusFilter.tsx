import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, List } from "lucide-react";

interface StatusFilterProps {
  selectedStatus: "All" | "Attempted" | "Unattempted";
  onStatusChange: (status: "All" | "Attempted" | "Unattempted") => void;
  stats: {
    total: number;
    attempted: number;
    unattempted: number;
    progress: number;
  };
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  stats,
}) => {
  const statusOptions = [
    {
      value: "Unattempted" as const,
      label: "Not Attempted", 
      icon: Circle,
      count: stats.unattempted,
      color: "secondary",
    },
    {
      value: "All" as const,
      label: "All Questions",
      icon: List,
      count: stats.total,
      color: "default",
    },
    {
      value: "Attempted" as const,
      label: "Attempted",
      icon: CheckCircle2,
      count: stats.attempted,
      color: "success",
    },
  ];

  return (
    <div className="rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {stats.attempted} of {stats.total} completed
          </span>
        </div>
        <Progress value={stats.progress} className="h-2" />
        <div className="space-y-1.5">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.value;

            return (
              <Button
                key={option.value}
                variant={isSelected ? "secondary" : "ghost"}
                onClick={() => onStatusChange(option.value)}
                className={`w-full justify-start h-auto py-2 px-3 font-normal hover:bg-secondary/80 ${
                  isSelected ? "bg-secondary" : ""
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{option.count}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
