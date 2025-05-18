
"use client";

import type { Lecture, Timestamp } from '@/types';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'studyTubeLectures';

export function useLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedLectures = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLectures) {
        setLectures(JSON.parse(storedLectures));
      }
    } catch (error) {
      console.error("Failed to load lectures from localStorage", error);
      toast({ title: "Error", description: "Could not load saved lectures.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!isLoading) { 
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lectures));
      } catch (error) {
        console.error("Failed to save lectures to localStorage", error);
        toast({ title: "Error", description: "Could not save lectures.", variant: "destructive" });
      }
    }
  }, [lectures, isLoading, toast]);

  const addLecture = useCallback(async (videoUrl: string, title: string, subject: string): Promise<boolean> => {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      toast({ title: "Invalid URL", description: "Please enter a valid YouTube video URL.", variant: "destructive" });
      return false;
    }

    if (lectures.some(lecture => lecture.youtubeVideoId === videoId)) {
      toast({ title: "Lecture Exists", description: "This lecture is already in your list.", variant: "default" });
      return false;
    }
    
    const lectureTitle = title || `Lecture: ${videoId}`;

    const newLecture: Lecture = {
      id: crypto.randomUUID(),
      youtubeVideoId: videoId,
      title: lectureTitle,
      subject: subject.trim() || "General",
      notes: "",
      thumbnailUrl: getYouTubeThumbnailUrl(videoId),
      videoUrl,
      timestamps: [], // Initialize timestamps
    };
    setLectures(prev => [newLecture, ...prev]);
    toast({ title: "Lecture Added", description: `"${lectureTitle}" has been added.` });
    return true;
  }, [lectures, toast]);

  const getLectureById = useCallback((id: string): Lecture | undefined => {
    return lectures.find(lecture => lecture.id === id);
  }, [lectures]);

  const updateLectureNotes = useCallback((id: string, notes: string) => {
    setLectures(prev => prev.map(lecture => lecture.id === id ? { ...lecture, notes } : lecture));
  }, [setLectures]);
  
  const deleteLecture = useCallback((id: string) => {
    const lectureToDelete = lectures.find(l => l.id === id);
    setLectures(prev => prev.filter(lecture => lecture.id !== id));
    if (lectureToDelete) {
      toast({ title: "Lecture Deleted", description: `"${lectureToDelete.title}" has been removed.` });
    }
  }, [lectures, toast]);

  const getSubjects = useCallback((): string[] => {
    const subjects = new Set(lectures.map(lecture => lecture.subject));
    return ["All", ...Array.from(subjects).sort()];
  }, [lectures]);

  const addTimestampToLecture = useCallback((lectureId: string, time: string, label: string) => {
    setLectures(prevLectures =>
      prevLectures.map(lecture => {
        if (lecture.id === lectureId) {
          const newTimestamp: Timestamp = { id: crypto.randomUUID(), time, label };
          return { ...lecture, timestamps: [...lecture.timestamps, newTimestamp] };
        }
        return lecture;
      })
    );
    toast({ title: "Timestamp Added", description: `Timestamp "${label}" added at ${time}.`});
  }, [toast]);

  const deleteTimestampFromLecture = useCallback((lectureId: string, timestampId: string) => {
    setLectures(prevLectures =>
      prevLectures.map(lecture => {
        if (lecture.id === lectureId) {
          return { ...lecture, timestamps: lecture.timestamps.filter(ts => ts.id !== timestampId) };
        }
        return lecture;
      })
    );
    toast({ title: "Timestamp Deleted", description: "Timestamp removed."});
  }, [toast]);


  return {
    lectures,
    isLoading,
    addLecture,
    getLectureById,
    updateLectureNotes,
    deleteLecture,
    getSubjects,
    addTimestampToLecture,
    deleteTimestampFromLecture,
  };
}
