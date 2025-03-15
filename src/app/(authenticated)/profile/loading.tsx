import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid gap-8">
        {/* Header Loading */}
        <div>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 text-center md:text-left space-y-2">
              <Skeleton className="h-10 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-36 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-8">
            {/* About Loading */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-24" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
            
            {/* Social Links Loading */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Skills Loading */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            {/* Work Experience Loading */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-40" />
              </div>
              <div className="space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-muted pb-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Education Loading */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-32" />
              </div>
              <div className="space-y-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-muted pb-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 