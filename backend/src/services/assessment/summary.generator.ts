import type { WorkStyleDimension } from './questions';
import { generateText } from '../../lib/llm';

export async function generateWorkStyleSummary(
  dimensionScores: Record<WorkStyleDimension, number>,
): Promise<string> {
  const traits = Object.entries(dimensionScores)
    .map(([dim, score]) => `${dim}: ${(score * 100).toFixed(0)}%`)
    .join(', ');

  const prompt = `Based on these work-style dimension scores (0-100%), write a 2-3 sentence plain-language summary for a non-technical user about their teamwork style. Be encouraging and specific. Scores: ${traits}`;

  const summary = await generateText(
    prompt,
    'You help people understand their work style in simple, friendly language. No jargon.',
  );

  if (summary.includes('unavailable')) {
    return buildFallbackSummary(dimensionScores);
  }
  return summary;
}

function buildFallbackSummary(scores: Record<WorkStyleDimension, number>): string {
  const collaborative = scores.collaboration > 0.6;
  const fastPaced = scores.pace > 0.6;
  const structured = scores.structure > 0.6;
  const parts: string[] = [];
  parts.push(
    collaborative
      ? 'You tend to work well in collaborative settings.'
      : 'You often prefer independent work with clear ownership.',
  );
  parts.push(
    fastPaced
      ? 'You are comfortable with fast-paced environments.'
      : 'You prefer a steady, thoughtful pace.',
  );
  parts.push(
    structured
      ? 'You value planning and structure.'
      : 'You adapt flexibly when priorities shift.',
  );
  return parts.join(' ');
}
