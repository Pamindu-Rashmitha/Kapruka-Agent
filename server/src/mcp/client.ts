import { createMCPClient } from '@ai-sdk/mcp';
import { env } from '../config/env.js';

let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;

/*Initializes and returns a singleton MCP client connected to Kapruka's
  Streamable HTTP endpoint. The client auto-discovers available tools.*/
export async function getMcpClient() {
  if (mcpClient) return mcpClient;

  console.log(`Connecting to Kapruka MCP at ${env.MCP_ENDPOINT}...`);

  mcpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: env.MCP_ENDPOINT,
    },
  });

  console.log('MCP client connected');
  return mcpClient;
}


//Returns Kapruka MCP tools in AI SDK format, ready to pass to streamText.

export async function getMcpTools() {
  const client = await getMcpClient();
  const tools = await client.tools();

  const originalSearch = tools['kapruka_search_products'];
  if (originalSearch) {
    const origExecute = (originalSearch as any).execute;
    if (origExecute) {
      (originalSearch as any).execute = async (args: any, context: any) => {
        const fixedArgs = { ...args };

        // Handle case where AI SDK passes flat args instead of nested under params
        if (!fixedArgs.params) {
          const paramsObj = { ...fixedArgs };
          for (const key of Object.keys(fixedArgs)) {
            delete fixedArgs[key];
          }
          fixedArgs.params = paramsObj;
        }

        if (fixedArgs.params.query && !fixedArgs.params.q) {
          fixedArgs.params.q = fixedArgs.params.query;
          delete fixedArgs.params.query;
        }

        // Force JSON response
        fixedArgs.params.response_format = 'json';

        return await origExecute(fixedArgs, context);
      };
    }
  }

  return tools;
}


//Gracefully close the MCP connection on server shutdown.
export async function closeMcpClient() {
  if (mcpClient) {
    await mcpClient.close();
    mcpClient = null;
    console.log('MCP client disconnected');
  }
}
