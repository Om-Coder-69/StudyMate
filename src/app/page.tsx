"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import AddLectureForm from '@/components/lecture/AddLectureForm';
import LectureList from '@/components/lecture/LectureList';
import SubjectPills from '@/components/lecture/SubjectPills';
import { useLectures } from '@/hooks/useLectures';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function HomePage() {
  const { 
    lectures, 
    isLoading: lecturesLoading, 
    addLecture, 
    deleteLecture,
    getSubjects 
  } = useLectures();
  
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const subjects = getSubjects();

  const handleAddLecture = async (videoUrl: string, title: string, subject: string) => {
    setFormIsLoading(true);
    const success = await addLecture(videoUrl, title, subject);
    setFormIsLoading(false);
    return success;
  };

  const filteredLectures = useMemo(() => {
    return lectures
      .filter(lecture => selectedSubject === "All" || lecture.subject === selectedSubject)
      .filter(lecture => lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) || lecture.subject.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [lectures, selectedSubject, searchTerm]);

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-6 flex-grow">
        <AddLectureForm onAddLecture={handleAddLecture} isLoading={formIsLoading} />
        
        <div className="my-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SubjectPills
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
          />
           <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lectures..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {lecturesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <LectureList lectures={filteredLectures} onDeleteLecture={deleteLecture} />
        )}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} StudyTube. Focus on learning.
      </footer>
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[180px] w-full rounded-xl" />
      <div className="space-y-2 p-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="p-2 flex justify-between">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-10" />
      </div>
    </div>
  );
}
