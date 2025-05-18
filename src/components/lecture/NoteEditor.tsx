"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { downloadTextFile } from '@/lib/utils';

interface NoteEditorProps {
  lectureId: string;
  lectureTitle: string;
  initialNotes: string;
  onSaveNotes: (lectureId: string, notes: string) => void;
}

export default function NoteEditor({ lectureId, lectureTitle, initialNotes, onSaveNotes }: NoteEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const { toast } = useToast();

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = () => {
    onSaveNotes(lectureId, notes);
    toast({ title: "Notes Saved", description: "Your notes have been updated successfully." });
  };

  const handleDownload = () => {
    if (notes.trim() === "") {
      toast({ title: "Empty Notes", description: "There are no notes to download.", variant: "default" });
      return;
    }
    downloadTextFile(`${lectureTitle}_notes.txt`, notes);
    toast({ title: "Notes Downloaded", description: "Notes downloaded as .txt file." });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="text-primary" />
          Lecture Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Start typing your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={15}
          className="resize-none text-base leading-relaxed"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Save Notes
          </Button>
          <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download as .txt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
