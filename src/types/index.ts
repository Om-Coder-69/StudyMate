export interface Timestamp {
  id: string;
  time: string; // e.g., "01:23:45" or "15:30"
  label: string;
}

export interface Lecture {
  id: string;
  youtubeVideoId: string;
  title: string;
  subject: string;
  notes: string;
  thumbnailUrl: string;
  videoUrl: string;
  timestamps: Timestamp[]; // Added for Key Timestamps
}
