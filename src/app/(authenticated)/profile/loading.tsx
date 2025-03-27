import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 max-w-6xl">
        <div className="grid gap-6 sm:gap-8 md:gap-10">
          <div>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              <div className="relative">
                <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-background" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <Skeleton className="h-10 w-48 mx-auto sm:mx-0" />
                </div>
                <Skeleton className="h-6 w-64 mx-auto sm:mx-0 mb-3" />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center sm:items-start mt-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8">
                {/* About Loading */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
                
                {/* Social Links Loading */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-36" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <Skeleton className="h-4 w-20 mb-1.5" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Skills Loading */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <div className="grid gap-6 sm:gap-8">
                {/* Work Experience Loading */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-40" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="space-y-8">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-muted pb-6">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Education Loading */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="space-y-8">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-muted pb-6">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 