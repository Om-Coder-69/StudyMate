export interface Lecture {
  id: string;
  youtubeVideoId: string;
  title: string;
  subject: string;
  notes: string;
  // summary?: string; // Removed summary
  thumbnailUrl: string;
  transcript?: string; 
  videoUrl: string;
}
