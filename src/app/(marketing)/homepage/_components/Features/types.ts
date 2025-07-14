import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  comingSoon?: boolean;
}

export interface FeatureCardProps extends Feature {
  className?: string;
} 