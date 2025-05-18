"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DistractionFreePlayer from '@/components/lecture/DistractionFreePlayer';
import NoteEditor from '@/components/lecture/NoteEditor';
import LectureSummary from '@/components/lecture/LectureSummary';
import { useLectures } from '@/hooks/useLectures';
import type { Lecture } from '@/types';
import { summarizeLecture, type SummarizeLectureInput, type SummarizeLectureOutput } from '@/ai/flows/summarize-lecture';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LecturePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getLectureById, updateLectureNotes, updateLectureSummary, isLoading: lecturesHookLoading } = useLectures();

  const [lecture, setLecture] = useState<Lecture | null | undefined>(undefined); // undefined: loading, null: not found
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const lectureId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (lectureId && !lecturesHookLoading) {
      const currentLecture = getLectureById(lectureId);
      setLecture(currentLecture);
      if (!currentLecture) {
        toast({
          title: "Lecture not found",
          description: "The lecture you are looking for does not exist or has been deleted.",
          variant: "destructive",
        });
        // Optionally redirect: router.push('/');
      }
    }
  }, [lectureId, getLectureById, lecturesHookLoading, toast, router]);

  const handleSaveNotes = (id: string, notes: string) => {
    updateLectureNotes(id, notes);
    if (lecture) {
      setLecture({ ...lecture, notes });
    }
  };

  const handleGenerateSummary = async () => {
    if (!lecture) return;

    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      // For this example, we'll assume a transcript isn't pre-fetched.
      // The summarizeLecture flow might attempt to get it or use other methods.
      const input: SummarizeLectureInput = {
        youtubeVideoId: lecture.youtubeVideoId,
        // transcript: lecture.transcript // if available
      };
      const result: SummarizeLectureOutput = await summarizeLecture(input);

      if (result.success && result.summary) {
        updateLectureSummary(lecture.id, result.summary);
        setLecture(prev => prev ? { ...prev, summary: result.summary } : null);
        toast({ title: "Summary Generated", description: "Lecture summary has been successfully generated." });
      } else {
        const errorMsg = result.summary || "Failed to generate summary. The video might not support it (e.g., no transcript available).";
        setSummaryError(errorMsg);
        toast({ title: "Summary Failed", description: errorMsg, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred during summary generation.";
      setSummaryError(errorMsg);
      toast({ title: "Summary Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (lecture === undefined || lecturesHookLoading) {
    return (
      <>
        <Header showBackButton />
        <main className="container mx-auto p-4 md:p-6 flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!lecture) {
    return (
      <>
        <Header showBackButton />
        <main className="container mx-auto p-4 md:p-6 flex-grow">
          <Card className="mt-10">
            <CardContent className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Lecture Not Found</h2>
              <p className="text-muted-foreground">
                The requested lecture could not be found. It might have been deleted or the link is incorrect.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // The AI flow determines if summary is possible. For UI, assume possible unless explicitly told otherwise.
  // The `summarizeLecture` function returns success: false if it fails, including if transcript isn't available.
  // We can use this as an indicator.
  const isSummaryPossible = true; // Default to true, actual check happens in AI flow.

  return (
    <>
      <Header showBackButton />
      <main className="container mx-auto p-4 md:p-6 flex-grow space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{lecture.title}</h1>
          <p className="text-lg text-muted-foreground">Subject: <span className="font-medium text-primary">{lecture.subject}</span></p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DistractionFreePlayer videoId={lecture.youtubeVideoId} title={lecture.title} />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <NoteEditor
              lectureId={lecture.id}
              lectureTitle={lecture.title}
              initialNotes={lecture.notes}
              onSaveNotes={handleSaveNotes}
            />
            <LectureSummary
              summary={lecture.summary}
              isLoading={isSummaryLoading}
              onGenerateSummary={handleGenerateSummary}
              isSummaryPossible={isSummaryPossible}
              generationError={summaryError}
            />
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} StudyTube. Keep learning!
      </footer>
    </>
  );
}
