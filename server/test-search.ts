import { getMcpClient } from './src/mcp/client.js';

async function test() {
  const client = await getMcpClient();
  const tools = await client.tools();
  
  const searchTool = tools['kapruka_search_products'];
  
  if (!searchTool) {
    console.error("Tool not found");
    return;
  }

  const results = [];
  try {
    results.push(await searchTool.execute({ params: { q: 'birthday', response_format: 'json' } }, { toolCallId: '1', messages: [] }));
  } catch(e) { console.log('json failed', e); }
  
  console.log("JSON RESULT TEXT:");
  console.log(results[0].content[0].text);

  process.exit(0);
}

test().catch(console.error);
