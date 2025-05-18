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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Youtube } from "lucide-react";

const FormSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid YouTube URL." }),
  title: z.string().min(1, { message: "Please enter a title for the lecture." }),
  subject: z.string().min(1, { message: "Please enter a subject." }),
});

interface AddLectureFormProps {
  onAddLecture: (videoUrl: string, title: string, subject: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function AddLectureForm({ onAddLecture, isLoading = false }: AddLectureFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      videoUrl: "",
      title: "",
      subject: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const success = await onAddLecture(data.videoUrl, data.title, data.subject);
    if (success) {
      form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
