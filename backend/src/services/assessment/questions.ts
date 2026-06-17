export type WorkStyleDimension =
  | 'collaboration'
  | 'pace'
  | 'riskTolerance'
  | 'communication'
  | 'structure'
  | 'conflictHandling'
  | 'commitment'
  | 'feedback';

export interface AssessmentQuestion {
  id: string;
  text: string;
  dimension: WorkStyleDimension;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 'q1', text: 'I prefer working closely with others on most tasks.', dimension: 'collaboration' },
  { id: 'q2', text: 'I am comfortable making decisions independently.', dimension: 'collaboration' },
  { id: 'q3', text: 'I thrive when projects move at a fast pace.', dimension: 'pace' },
  { id: 'q4', text: 'I prefer a steady, predictable work rhythm.', dimension: 'pace' },
  { id: 'q5', text: 'I am willing to take significant risks for high rewards.', dimension: 'riskTolerance' },
  { id: 'q6', text: 'I prefer proven approaches over experimental ones.', dimension: 'riskTolerance' },
  { id: 'q7', text: 'I communicate directly, even when messages are difficult.', dimension: 'communication' },
  { id: 'q8', text: 'I adapt my communication style to avoid conflict.', dimension: 'communication' },
  { id: 'q9', text: 'I prefer detailed plans before starting work.', dimension: 'structure' },
  { id: 'q10', text: 'I adapt quickly when plans change unexpectedly.', dimension: 'structure' },
  { id: 'q11', text: 'I address disagreements openly and promptly.', dimension: 'conflictHandling' },
  { id: 'q12', text: 'I avoid confrontation and seek compromise.', dimension: 'conflictHandling' },
  { id: 'q13', text: 'I can commit full-time intensity to a project.', dimension: 'commitment' },
  { id: 'q14', text: 'I balance multiple projects and priorities.', dimension: 'commitment' },
  { id: 'q15', text: 'I welcome frequent feedback on my work.', dimension: 'feedback' },
  { id: 'q16', text: 'I prefer feedback in scheduled reviews only.', dimension: 'feedback' },
  { id: 'q17', text: 'I enjoy brainstorming with a team regularly.', dimension: 'collaboration' },
  { id: 'q18', text: 'Urgent deadlines motivate my best work.', dimension: 'pace' },
  { id: 'q19', text: 'I speak up when I disagree with team decisions.', dimension: 'communication' },
  { id: 'q20', text: 'I maintain long-term dedication to projects.', dimension: 'commitment' },
];

export function computeDimensionScores(
  responses: Record<string, number>,
): Record<WorkStyleDimension, number> {
  const sums: Record<string, { total: number; count: number }> = {};

  for (const question of ASSESSMENT_QUESTIONS) {
    const value = responses[question.id];
    if (value === undefined) continue;
    if (!sums[question.dimension]) sums[question.dimension] = { total: 0, count: 0 };
    sums[question.dimension].total += value;
    sums[question.dimension].count += 1;
  }

  const dimensions = [
    'collaboration',
    'pace',
    'riskTolerance',
    'communication',
    'structure',
    'conflictHandling',
    'commitment',
    'feedback',
  ] as const;

  const scores: Record<string, number> = {};
  for (const dim of dimensions) {
    const entry = sums[dim];
    scores[dim] = entry ? entry.total / entry.count / 5 : 0.5;
  }
  return scores as Record<WorkStyleDimension, number>;
}
