export interface Lecture {
  id: string;
  youtubeVideoId: string;
  title: string;
  subject: string;
  notes: string;
  summary?: string;
  thumbnailUrl: string;
  transcript?: string; 
  videoUrl: string;
}
