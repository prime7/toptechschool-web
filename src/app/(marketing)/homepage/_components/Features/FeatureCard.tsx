import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FeatureCardProps } from './types';
import SpotlightCard from '@/components/common/SpotlightCard';

const FeatureList = React.memo(function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-4">
      {features.map((feature) => (
        <li className="flex items-start gap-3 dark:text-muted-foreground" key={feature}>
          <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
          <span className="text-sm leading-relaxed font-medium">{feature}</span>
        </li>
      ))}
    </ul>
  );
});

export const FeatureCard = React.memo(function FeatureCard({
  title,
  description,
  icon: Icon,
  features,
  comingSoon,
  className,
}: FeatureCardProps) {
  return (
    <SpotlightCard
      spotlightColor="rgba(0, 229, 255, 0.2)"
      className={cn(
        "bg-transparent backdrop-blur-sm border-none",
        className
      )}
    >
      {comingSoon && (
        <Badge
          variant="secondary"
          className="absolute top-6 right-6 text-emerald-600 bg-emerald-500/10 font-medium px-3 py-1 rounded-full"
        >
          Coming soon
        </Badge>
      )}

      <CardHeader className="space-y-8 pb-6 pt-8 px-8">
        <div className="bg-emerald-500/10 dark:bg-emerald-900/30 w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm">
          <Icon className="text-emerald-600" size={28} />
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold leading-tight">{title}</h3>
          <p className="text-sm font-medium leading-relaxed dark:text-muted-foreground">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <FeatureList features={features} />
      </CardContent>
    </SpotlightCard>
  );
}); 