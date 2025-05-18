import type { Lecture } from '@/types';
import LectureItem from './LectureItem';
import { FileQuestion } from 'lucide-react';

interface LectureListProps {
  lectures: Lecture[];
  onDeleteLecture: (id: string) => void;
}

export default function LectureList({ lectures, onDeleteLecture }: LectureListProps) {
  if (lectures.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <FileQuestion className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg">No lectures found.</p>
        <p>Add some lectures to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {lectures.map(lecture => (
        <LectureItem key={lecture.id} lecture={lecture} onDelete={onDeleteLecture} />
      ))}
    </div>
  );
}
