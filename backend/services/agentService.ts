const MAX_ROUND_TRIPS = 3;

export async function runAgent({ prompt }: { prompt: string }): Promise<{ text: string }> {
  const tools = [
    {
      type: 'function',
      function: {
        name: 'filter_notes',
        description: 'Search the notes collection by substring match on content. Returns up to 10 matches.',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
      },
    },
  ];

  const messages: any[] = [
    { role: 'system', content: 'You are an AI assistant helping the user draft notes. When the user asks you to find a note, extract the most likely short substring or keywords from their prompt and use the filter_notes tool to search for it. Be proactive and use the tool rather than asking for clarification.' },
    { role: 'user', content: prompt }
  ];

  for (let i = 0; i < MAX_ROUND_TRIPS; i++) {
    let r;
    try {
      r = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages,
          tools,
          stream: false,
        }),
      });
    } catch (err) {
      const error = new Error('Ollama unreachable') as Error & { status?: number };
      error.status = 502;
      throw error;
    }

    if (!r.ok) {
        const err = new Error('Ollama error') as Error & { status?: number };
        err.status = 502;
        throw err;
    }

    const { message } = await r.json();
    messages.push(message);

    if (!message.tool_calls?.length) {
      return { text: message.content ?? '' };
    }

    for (const call of message.tool_calls) {
      const args = typeof call.function.arguments === 'string'
        ? JSON.parse(call.function.arguments)
        : call.function.arguments;
      
      const res = await fetch(`http://localhost:3001/notes/filter?query=${encodeURIComponent(args.query)}`);
      messages.push({ role: 'tool', content: await res.text() });
    }
  }

  const err = new Error('Agent exceeded round-trip cap') as Error & { status?: number };
  err.status = 504;
  throw err;
}
