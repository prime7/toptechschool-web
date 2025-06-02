import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, List } from 'lucide-react';

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
  stats 
}) => {
  const statusOptions = [
    {
      value: "All" as const,
      label: "All Questions",
      icon: List,
      count: stats.total,
      color: "default"
    },
    {
      value: "Attempted" as const,
      label: "Attempted",
      icon: CheckCircle2,
      count: stats.attempted,
      color: "success"
    },
    {
      value: "Unattempted" as const,
      label: "Not Attempted",
      icon: Circle,
      count: stats.unattempted,
      color: "secondary"
    }
  ];

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.attempted}/{stats.total} questions
            </span>
          </div>
          <Progress value={stats.progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {stats.progress}% complete
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.value;
            
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onStatusChange(option.value)}
                className={`flex items-center gap-2 transition-all ${
                  isSelected ? 'ring-2 ring-ring ring-offset-2' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
                <Badge 
                  variant={isSelected ? "secondary" : "default"}
                  className="ml-1"
                >
                  {option.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;