// Summarize Lecture Feature
'use server';

/**
 * @fileOverview Summarizes a YouTube lecture using AI, focusing on key concepts.
 *
 * - summarizeLecture - A function to generate a summary of a YouTube lecture.
 * - SummarizeLectureInput - Input type for the summarizeLecture function.
 * - SummarizeLectureOutput - Return type for the summarizeLecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLectureInputSchema = z.object({
  youtubeVideoId: z.string().describe('The ID of the YouTube video to summarize.'),
  transcript: z.string().optional().describe('The transcript of the YouTube video. If not provided, the tool will attempt to fetch it.'),
});
export type SummarizeLectureInput = z.infer<typeof SummarizeLectureInputSchema>;

const SummarizeLectureOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the YouTube lecture.'),
  success: z.boolean().describe('A boolean indicating whether the summary was successfully generated.'),
});
export type SummarizeLectureOutput = z.infer<typeof SummarizeLectureOutputSchema>;

export async function summarizeLecture(input: SummarizeLectureInput): Promise<SummarizeLectureOutput> {
  return summarizeLectureFlow(input);
}

const summarizeLecturePrompt = ai.definePrompt({
  name: 'summarizeLecturePrompt',
  input: {schema: SummarizeLectureInputSchema},
  output: {schema: SummarizeLectureOutputSchema},
  prompt: `You are an AI assistant that summarizes YouTube lectures for students.

  Please provide a concise summary of the following lecture transcript:

  {{#if transcript}}
  Transcript: {{{transcript}}}
  {{else}}
  No transcript available.
  {{/if}}
  `,
});

const summarizeLectureFlow = ai.defineFlow(
  {
    name: 'summarizeLectureFlow',
    inputSchema: SummarizeLectureInputSchema,
    outputSchema: SummarizeLectureOutputSchema,
  },
  async input => {
    try {
      const {output} = await summarizeLecturePrompt(input);
      return {
        ...output!,
        success: true,
      };
    } catch (e) {
      console.error('Failed to summarize lecture:', e);
      return {
        summary: 'Failed to summarize lecture.',
        success: false,
      };
    }
  }
);
