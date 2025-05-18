
'use server';
/**
 * @fileOverview Handles student doubts about a lecture using an AI chat model.
 *
 * - askDoubt - A function to get an AI response to a student's question.
 * - AskDoubtInput - Input type for the askDoubt function.
 * - AskDoubtOutput - Return type for the askDoubt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Message } from 'genkit';


const AskDoubtInputSchema = z.object({
  lectureTitle: z.string().describe('The title of the lecture.'),
  lectureSubject: z.string().describe('The subject of the lecture.'),
  userQuestion: z.string().describe('The question asked by the user regarding the lecture.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('Previous conversation history to maintain context. User messages are questions, model messages are AI answers.'),
});
export type AskDoubtInput = z.infer<typeof AskDoubtInputSchema>;

const AskDoubtOutputSchema = z.object({
  aiAnswer: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type AskDoubtOutput = z.infer<typeof AskDoubtOutputSchema>;


// Exported function that calls the flow
export async function askDoubt(input: AskDoubtInput): Promise<AskDoubtOutput> {
    return askDoubtFlow(input);
}

const askDoubtFlow = ai.defineFlow(
  {
    name: 'askDoubtFlow',
    inputSchema: AskDoubtInputSchema,
    outputSchema: AskDoubtOutputSchema,
  },
  async (input) => {
    const chatMessages: Message[] = [];

    // System-like priming message
    chatMessages.push({
        role: 'user',
        content: `Context: You are an AI teaching assistant for StudyTube. The current lecture is titled "${input.lectureTitle}" (Subject: "${input.lectureSubject}"). Your role is to answer the student's questions about this specific lecture. Be clear and concise. If a question is off-topic, politely state that you can only discuss concepts related to the current lecture. If a question is too vague, ask for clarification. Keep your answers focused and helpful for learning.`
    });
    chatMessages.push({ role: 'model', content: `Understood. I am ready to help with questions about the lecture on "${input.lectureTitle}". How can I assist you?` });


    if (input.chatHistory) {
      input.chatHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'model') {
             chatMessages.push({ role: msg.role, content: msg.content });
        }
      });
    }
    chatMessages.push({ role: 'user', content: input.userQuestion });

    try {
      const response = await ai.generate({
        prompt: chatMessages,
      });

      const aiAnswer = response.text;
      if (aiAnswer) {
        return { aiAnswer };
      }
      return { aiAnswer: "Sorry, I couldn't formulate a response at this time. Please try rephrasing your question." };

    } catch (error) {
      console.error("Error in askDoubtFlow:", error);
      let errorMessage = "Sorry, an error occurred while trying to answer your question.";
      if (error instanceof Error && error.message) {
        // Potentially log more details or check for specific error types from Genkit/Gemini
        // For user-facing message, keep it general unless specific errors can be handled gracefully.
        // errorMessage += ` Details: ${error.message}`; // Avoid exposing too much detail
      }
      return { aiAnswer: errorMessage };
    }
  }
);

