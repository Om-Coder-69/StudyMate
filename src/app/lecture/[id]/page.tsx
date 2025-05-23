
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DistractionFreePlayer from '@/components/lecture/DistractionFreePlayer';
import NoteEditor from '@/components/lecture/NoteEditor';
import LectureTimestamps from '@/components/lecture/LectureTimestamps'; // Added
import { useLectures } from '@/hooks/useLectures';
import type { Lecture } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LecturePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { 
    getLectureById, 
    updateLectureNotes, 
    isLoading: lecturesHookLoading,
    addTimestampToLecture,
    deleteTimestampFromLecture 
  } = useLectures();

  const [lecture, setLecture] = useState<Lecture | null | undefined>(undefined);

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
      }
    }
  }, [lectureId, getLectureById, lecturesHookLoading, toast, router]);

  const handleSaveNotes = (id: string, notes: string) => {
    updateLectureNotes(id, notes);
    if (lecture) {
      setLecture({ ...lecture, notes });
    }
  };

  const handleAddTimestamp = (time: string, label: string) => {
    if (lecture) {
      addTimestampToLecture(lecture.id, time, label);
      // Optimistically update local state or rely on useLectures to update
      const updatedLecture = getLectureById(lecture.id);
      if (updatedLecture) setLecture(updatedLecture);
    }
  };

  const handleDeleteTimestamp = (timestampId: string) => {
    if (lecture) {
      deleteTimestampFromLecture(lecture.id, timestampId);
      const updatedLecture = getLectureById(lecture.id);
      if (updatedLecture) setLecture(updatedLecture);
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
            <LectureTimestamps 
              timestamps={lecture.timestamps || []}
              onAddTimestamp={handleAddTimestamp}
              onDeleteTimestamp={handleDeleteTimestamp}
            />
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} StudyTube. Keep learning!</p>
        <p>Created by Om Mittal</p>
      </footer>
    </>
  );
}
