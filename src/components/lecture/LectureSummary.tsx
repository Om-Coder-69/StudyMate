"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LectureSummaryProps {
  summary?: string;
  isLoading: boolean;
  onGenerateSummary: () => void;
  isSummaryPossible: boolean; // True if transcript is available or summarization can be attempted
  generationError?: string | null;
}

export default function LectureSummary({
  summary,
  isLoading,
  onGenerateSummary,
  isSummaryPossible,
  generationError
}: LectureSummaryProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="text-primary" />
          AI Lecture Summary
        </CardTitle>
        {!summary && !isLoading && isSummaryPossible && (
          <CardDescription>Get a quick overview of the lecture's key points.</CardDescription>
        )}
         {!isSummaryPossible && (
          <CardDescription className="text-destructive-foreground bg-destructive p-2 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4"/> Summary not available for this video (e.g., no transcript).
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <p>Generating summary... This may take a moment.</p>
          </div>
        )}
        {!isLoading && summary && (
          <ScrollArea className="h-60 w-full rounded-md border p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
          </ScrollArea>
        )}
        {!isLoading && !summary && isSummaryPossible && !generationError && (
          <Button onClick={onGenerateSummary} className="w-full sm:w-auto" disabled={!isSummaryPossible}>
            Generate Summary
          </Button>
        )}
        {!isLoading && generationError && (
           <div className="text-destructive p-3 border border-destructive bg-destructive/10 rounded-md">
            <p className="font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4"/>Error generating summary:</p>
            <p className="text-sm">{generationError}</p>
            {isSummaryPossible && (
                 <Button onClick={onGenerateSummary} variant="outline" size="sm" className="mt-2">
                    Try Again
                 </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
