interface CompositionResultsProps {
  result: {
    recommendedRoles: Array<{ title: string; prioritySkills: string[]; idealTraits: string[]; rationale: string }>;
    filledRoles: Array<{ title: string }>;
    gapRoles: Array<{ title: string; priority?: string }>;
    insights: string[];
    rationale: string;
  };
}

export function CompositionResults({ result }: CompositionResultsProps) {
  return (
    <div className="card space-y-6">
      <p className="text-sm text-slate-600">{result.rationale}</p>
      <section>
        <h3 className="font-medium">Recommended roles</h3>
        <ul className="mt-2 space-y-3">
          {result.recommendedRoles.map((role) => (
            <li key={role.title} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold">{role.title}</p>
              <p className="mt-1 text-sm text-slate-600">Skills: {role.prioritySkills.join(', ')}</p>
              <p className="text-sm text-slate-600">{role.rationale}</p>
            </li>
          ))}
        </ul>
      </section>
      {result.gapRoles.length > 0 && (
        <section>
          <h3 className="font-medium">Gaps to fill</h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
            {result.gapRoles.map((g) => (
              <li key={g.title}>{g.title}</li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h3 className="font-medium">Insights</h3>
        <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
          {result.insights.map((insight, i) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
