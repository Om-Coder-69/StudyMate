import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";

interface SubjectPillsProps {
  subjects: string[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export default function SubjectPills({ subjects, selectedSubject, onSelectSubject }: SubjectPillsProps) {
  if (subjects.length <= 1 && subjects[0] === "All") { // Only "All" means no subjects yet
    return null;
  }
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        Filter by Subject
      </h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-2 pb-2">
          {subjects.map(subject => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectSubject(subject)}
              className="rounded-full"
            >
              {subject}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
