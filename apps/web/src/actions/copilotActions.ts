"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || \'dummy-key\',
});

export type CopilotResponse = {
  message: string;
  uiAction?: {
    type: 'NAVIGATE' | 'SEARCH' | 'CREATE_CAMPAIGN';
    payload: any;
  };
};

export async function processCopilotMessage(
  userMessage: string,
  context: { currentPath: string; propertyId?: string; workspaceContext?: string }
): Promise<CopilotResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the AI Copilot for Land Intelligence OS, an advanced platform for real estate professionals.
${context.workspaceContext ? `\nWORKSPACE DIRECTIVE:\n${context.workspaceContext}\n` : ''}
You can answer questions, but you can also control the UI. 
Your goal is to be as helpful and agentic as possible.
Current User Context: 
- Path: ${context.currentPath}
- Viewing Property ID: ${context.propertyId || 'None'}

If the user asks to navigate somewhere, use the navigate tool.
If the user asks to draft a mailer or start a campaign for the current property, use the create_campaign tool.
If the user asks to search for something, use the navigate tool to go to the global search or a specific page.
If you just need to chat, respond normally. Keep responses brief and punchy.
`
        },
        { role: "user", content: userMessage }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "navigate_ui",
            description: "Navigates the user to a different page or section in the app.",
            parameters: {
              type: "object",
              properties: {
                target: {
                  type: "string",
                  enum: ["portfolio", "discover", "crm", "underwriting", "home", "search"],
                  description: "The main section to navigate to"
                }
              },
              required: ["target"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "create_campaign",
            description: "Opens the campaign launchpad for a specific property to draft a message.",
            parameters: {
              type: "object",
              properties: {
                propertyId: {
                  type: "string",
                  description: "The ID of the property to start a campaign for. If omitted, use the one from context."
                }
              },
              required: []
            }
          }
        }
      ],
      tool_choice: "auto",
    });

    const message = response.choices[0].message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      
      if (toolCall.type === "function") {
        if (toolCall.function.name === "navigate_ui") {
          const args = JSON.parse(toolCall.function.arguments);
          return {
            message: `Navigating you to ${args.target}...`,
            uiAction: {
              type: 'NAVIGATE',
              payload: { target: args.target }
            }
          };
        }
        
        if (toolCall.function.name === "create_campaign") {
          const args = JSON.parse(toolCall.function.arguments);
          const pid = args.propertyId || context.propertyId;
          
          if (!pid) {
            return { message: "I need to know which property you want to target. Please navigate to a property first or specify one." };
          }
          
          return {
            message: "Opening the Campaign Launchpad for this property...",
            uiAction: {
              type: 'CREATE_CAMPAIGN',
              payload: { propertyId: pid }
            }
          };
        }
      }
    }

    return {
      message: message.content || "I couldn't process that request."
    };

  } catch (error) {
    console.error("Copilot Error:", error);
    return {
      message: "I encountered an error trying to process your request."
    };
  }
}
