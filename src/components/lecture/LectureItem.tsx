import type { Lecture } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LectureItemProps {
  lecture: Lecture;
  onDelete: (id: string) => void;
}

export default function LectureItem({ lecture, onDelete }: LectureItemProps) {
  return (
    <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/lecture/${lecture.id}`} className="block">
          <Image
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            width={320}
            height={180}
            className="w-full h-auto object-cover aspect-video"
            data-ai-hint="youtube thumbnail"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/lecture/${lecture.id}`}>
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors mb-2 line-clamp-2">
            {lecture.title}
          </CardTitle>
        </Link>
        <Badge variant="secondary">{lecture.subject}</Badge>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center gap-2">
        <Button asChild variant="default" size="sm">
          <Link href={`/lecture/${lecture.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="text-muted-foreground" disabled> {/* Offline playback is complex */}
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Offline playback is not directly supported. <br/>Use YouTube Premium for official offline features.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="icon" onClick={() => onDelete(lecture.id)} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
