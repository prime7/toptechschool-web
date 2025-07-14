import React from 'react';
import { Section } from '@/components/common/Section';
import { Badge } from '@/components/ui/badge';
import { FeatureCard } from './FeatureCard';
import { FEATURES } from './constants';

const FeaturesHeader = React.memo(function FeaturesHeader() {
  return (
    <div className="text-center mb-10">
      <Badge
        className="mb-8 py-1.5 px-4 bg-emerald-100/80 hover:bg-emerald-100/80 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm"
      >
        ✨ Supercharge Your Career Growth
      </Badge>

      <h2 className="text-4xl font-bold mb-6">
        Cutting-Edge{' '}
        <span className="text-emerald-600 dark:text-emerald-400">
          Features
        </span>
      </h2>
      <p className="dark:text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
        Our platform combines AI technology with human expertise to provide
        you with the most comprehensive job search toolkit.
      </p>
    </div>
  );
});

export const Features = React.memo(function Features() {
  return (
    <Section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FeaturesHeader />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </div>
    </Section>
  );
});
