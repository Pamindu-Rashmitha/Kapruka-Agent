import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getMcpTools } from '../mcp/client.js';
import { buildSystemPrompt } from './systemPrompt.js';
import type { ISession } from '../db/models/Session.js';
import type { Response } from 'express';


//Handles a chat request by streaming an AI response with MCP tool access.
//The AI automatically discovers and executes Kapruka MCP tools 

export async function handleChatStream(
  uiMessages: any[],
  session: ISession | null,
  res: Response
): Promise<void> {
  // Fetch dynamically discovered MCP tools from Kapruka
  const mcpTools = await getMcpTools();

  const systemPrompt = buildSystemPrompt(session);

  // Convert UIMessages (from @ai-sdk/react v3) into ModelMessages for streamText
  const messages = await convertToModelMessages(uiMessages);

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    tools: mcpTools,
    stopWhen: stepCountIs(5),
    onError: (error) => {
      console.error('streamText error:', error);
    },
  });

  // Pipe the AI SDK UI message stream to the Express response.
  // The @ai-sdk/react v3 useChat hook understands this format.
  result.pipeUIMessageStreamToResponse(res);
}

