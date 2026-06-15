import { getMcpClient } from './client.js';

async function main() {
  try {
    console.log('Connecting to MCP server and fetching tools...');
    const client = await getMcpClient();
    const tools = await client.tools();

    console.log('\nAvailable MCP Tools');
    const toolNames = Object.keys(tools);
    if (toolNames.length === 0) {
      console.log('No tools found.');
      await client.close();
      return;
    }

    toolNames.forEach((name, index) => {
      const tool = tools[name] as any;
      console.log(`\n[${index + 1}] Tool Name: ${name}`);
      console.log(`Description: ${tool.description}`);
      if (tool.parameters) {
        console.log('Parameters:');
        console.log(JSON.stringify(tool.parameters.shape || tool.parameters, null, 2));
      }
    });

    await client.close();
  } catch (error) {
    console.error('Error fetching MCP tools:', error);
  }
}

main();
