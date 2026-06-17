import { generateText } from '../../lib/llm';
import type { DimensionScores } from './scorer';
import type { RiskFlag } from './risk-detector';

export async function generateExplanations(
  scores: DimensionScores,
  risks: RiskFlag[],
  successProbability: number,
): Promise<Record<string, string>> {
  const riskSummary = risks.map((r) => `- ${r.type}: ${r.explanation}`).join('\n');
  const prompt = `Write plain-language explanations for a team compatibility report. Non-technical audience.
Dimension scores (0-1): workStyle=${scores.workStyleAlignment.toFixed(2)}, goals=${scores.goalAlignment.toFixed(2)}, skills=${scores.skillComplementarity.toFixed(2)}, communication=${scores.communicationFit.toFixed(2)}
Success probability: ${successProbability}%
Risks:
${riskSummary || 'None identified'}

Return JSON with keys: workStyleAlignment, goalAlignment, skillComplementarity, communicationFit, overall. Each value is 1-2 sentences.`;

  const raw = await generateText(
    prompt,
    'Respond with valid JSON only. No markdown fences.',
  );

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed;
  } catch {
    return buildFallback(scores, risks, successProbability);
  }
}

function buildFallback(
  scores: DimensionScores,
  risks: RiskFlag[],
  successProbability: number,
): Record<string, string> {
  return {
    workStyleAlignment: `Work-style alignment is ${(scores.workStyleAlignment * 100).toFixed(0)}% based on assessment responses.`,
    goalAlignment: `Goal alignment is ${(scores.goalAlignment * 100).toFixed(0)}% based on shared project types and timelines.`,
    skillComplementarity: `Skill complementarity is ${(scores.skillComplementarity * 100).toFixed(0)}% considering primary skills across the team.`,
    communicationFit: `Communication fit is ${(scores.communicationFit * 100).toFixed(0)}% based on communication style preferences.`,
    overall: `Overall team success probability is ${successProbability}%. ${risks.length > 0 ? `Key risks: ${risks.map((r) => r.explanation).join(' ')}` : 'No major risks identified.'}`,
  };
}
