
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import type { Timestamp } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, PlusCircle, Trash2, ListChecks } from 'lucide-react';

interface LectureTimestampsProps {
  timestamps: Timestamp[];
  onAddTimestamp: (time: string, label: string) => void;
  onDeleteTimestamp: (timestampId: string) => void;
}

export default function LectureTimestamps({ timestamps, onAddTimestamp, onDeleteTimestamp }: LectureTimestampsProps) {
  const [timeInput, setTimeInput] = useState('');
  const [labelInput, setLabelInput] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!timeInput.trim() || !labelInput.trim()) return;
    // Basic time validation (HH:MM:SS or MM:SS)
    if (!/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(timeInput.trim())) {
        alert("Please enter time in HH:MM:SS or MM:SS format.");
        return;
    }
    onAddTimestamp(timeInput.trim(), labelInput.trim());
    setTimeInput('');
    setLabelInput('');
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListChecks className="text-primary" />
          Key Timestamps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-60 w-full rounded-md border">
          <div className="p-4 space-y-3">
            {timestamps.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No key timestamps added yet.
              </p>
            )}
            {timestamps.map((ts) => (
              <div
                key={ts.id}
                className="flex items-center justify-between gap-2 p-2 rounded-md bg-secondary/30"
              >
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-mono text-sm text-primary">{ts.time}</span>
                </div>
                <p className="text-sm text-foreground truncate flex-grow" title={ts.label}>{ts.label}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTimestamp(ts.id)}
                  className="text-destructive hover:bg-destructive/10 h-7 w-7"
                  aria-label="Delete timestamp"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full items-start sm:items-end gap-2">
          <div className="flex-grow w-full sm:w-auto">
            <label htmlFor="timestamp-time" className="text-xs font-medium text-muted-foreground">Time (e.g., 02:15)</label>
            <Input
              id="timestamp-time"
              type="text"
              placeholder="MM:SS or HH:MM:SS"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="flex-1 mt-1"
              aria-label="Timestamp time"
            />
          </div>
          <div className="flex-grow w-full sm:w-auto">
             <label htmlFor="timestamp-label" className="text-xs font-medium text-muted-foreground">Label</label>
            <Input
              id="timestamp-label"
              type="text"
              placeholder="Brief description"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              className="flex-1 mt-1"
              aria-label="Timestamp label"
            />
          </div>
          <Button type="submit" disabled={!timeInput.trim() || !labelInput.trim()} className="w-full sm:w-auto mt-2 sm:mt-0 self-end sm:self-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add 
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
