
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Youtube, ListVideo } from "lucide-react";
import { useState } from "react";

const SingleLectureFormSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid YouTube URL." }).refine(val => val.includes("youtube.com/watch?v=") || val.includes("youtu.be/"), { message: "Please enter a valid YouTube video URL."}),
  title: z.string().min(1, { message: "Please enter a title for the lecture." }),
  subject: z.string().min(1, { message: "Please enter a subject." }),
});

const PlaylistFormSchema = z.object({
  playlistUrl: z.string().url({ message: "Please enter a valid YouTube playlist URL." }).refine(val => val.includes("youtube.com/playlist?list="), { message: "Please enter a valid YouTube playlist URL (e.g., youtube.com/playlist?list=PLxxxx)."}),
  subject: z.string().min(1, { message: "Please enter a subject for this playlist." }),
});

interface AddLectureFormProps {
  onAddLecture: (videoUrl: string, title: string, subject: string) => Promise<boolean>;
  onAddPlaylist: (playlistUrl: string, subject: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function AddLectureForm({ onAddLecture, onAddPlaylist, isLoading = false }: AddLectureFormProps) {
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
          Add New Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single">Single Video</TabsTrigger>
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
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
                      <FormLabel>Video Title</FormLabel>
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
                  {isLoading ? "Adding Video..." : "Add Video"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="playlist">
            <Form {...playlistForm}>
              <form onSubmit={playlistForm.handleSubmit(onSubmitPlaylist)} className="space-y-6">
                <FormField
                  control={playlistForm.control}
                  name="playlistUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Playlist URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.youtube.com/playlist?list=PL..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={playlistForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Subject for Playlist</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development Series" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                  <ListVideo className="mr-2 h-4 w-4" />
                  {isLoading ? "Adding Playlist..." : "Add Playlist"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
