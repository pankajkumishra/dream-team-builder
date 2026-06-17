import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getLlmClient(): OpenAI | null {
  if (client) return client;

  if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
    client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
    });
    return client;
  }

  if (process.env.OPENAI_API_KEY) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return client;
  }

  return null;
}

export async function generateText(prompt: string, system?: string): Promise<string> {
  const llm = getLlmClient();
  if (!llm) {
    return 'Summary unavailable — configure OPENAI_API_KEY for AI-generated explanations.';
  }

  const response = await llm.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      ...(system ? [{ role: 'system' as const, content: system }] : []),
      { role: 'user' as const, content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}
