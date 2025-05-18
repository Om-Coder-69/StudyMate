
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Tabs imports are present but Tabs component is not used in the current return JSX
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Youtube } from "lucide-react";
import { useState } from "react";

const SingleLectureFormSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid YouTube URL." }),
  title: z.string().min(1, { message: "Please enter a title for the lecture." }),
  subject: z.string().min(1, { message: "Please enter a subject." }),
});

const PlaylistFormSchema = z.object({
  playlistUrl: z.string().url({ message: "Please enter a valid YouTube playlist URL." }),
 subject: z.string().min(1, { message: "Please enter a subject." }),
});

interface AddLectureFormProps {
  onAddLecture: (videoUrl: string, title: string, subject: string) => Promise<boolean>;
  onAddPlaylist: (playlistUrl: string, subject: string) => Promise<boolean>; // New prop for adding playlist
  isLoading?: boolean;
}

export default function AddLectureForm({ onAddLecture, onAddPlaylist, isLoading = false }: AddLectureFormProps) {
  // activeTab state is present but not currently used to switch forms in the UI
  const [activeTab, setActiveTab] = useState("single"); 

  const singleLectureForm = useForm<z.infer<typeof SingleLectureFormSchema>>({
    resolver: zodResolver(SingleLectureFormSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
      subject: "",
    },
  });

  const playlistForm = useForm<z.infer<typeof PlaylistFormSchema>>({
    resolver: zodResolver(PlaylistFormSchema),
    defaultValues: {
      playlistUrl: "",
      subject: "",
    },
  });

  async function onSubmitSingle(data: z.infer<typeof SingleLectureFormSchema>) {
    const success = await onAddLecture(data.videoUrl, data.title, data.subject);
    if (success) {
      singleLectureForm.reset();
    }
  }

  // onSubmitPlaylist is defined but not currently wired up in the form
  async function onSubmitPlaylist(data: z.infer<typeof PlaylistFormSchema>) {
    const success = await onAddPlaylist(data.playlistUrl, data.subject);
    if (success) {
      playlistForm.reset();
    }
  }

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Youtube className="text-primary" />
          Add New Lecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 
          The component currently renders a single form. 
          If Tabs functionality for single/playlist is desired, the JSX structure would need
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>...</TabsList>
            <TabsContent value="single">...</TabsContent>
            <TabsContent value="playlist">...</TabsContent>
          </Tabs>
        */}
        <Form {...singleLectureForm}>
          <form onSubmit={singleLectureForm.handleSubmit(onSubmitSingle)} className="space-y-6">
            <FormField
              control={singleLectureForm.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={singleLectureForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lecture Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Quantum Physics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={singleLectureForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Physics, Math, History" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isLoading ? "Adding..." : "Add Lecture"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
