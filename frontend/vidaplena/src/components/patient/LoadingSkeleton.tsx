import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BackgroundElements } from './BackgroundElements';

export function LoadingSkeleton() {
  return (
    <div className="relative overflow-hidden space-y-8 w-full min-h-[70vh] p-8 rounded-2xl">
      {/* Elementos de fundo animados */}
      <BackgroundElements isLoading={true} />

      <div className="flex justify-between items-center relative z-10">
        <Skeleton className="w-64 h-12" />
        <Skeleton className="w-40 h-10" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-500">Carregando dados...</span>
        </div>
      </div>
    </div>
  );
}