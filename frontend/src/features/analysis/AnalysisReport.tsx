'use client';

interface AnalysisReportProps {
  report: {
    successProbability?: number;
    confidenceLevel: string;
    dimensionScores?: Record<string, number>;
    riskFlags?: Array<{ type: string; severity: string; explanation: string }>;
    explanations?: Record<string, string>;
    staleReason?: string;
    status: string;
  };
}

export function AnalysisReport({ report }: AnalysisReportProps) {
  return (
    <div className="card space-y-6">
      {report.status === 'stale' && report.staleReason && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="alert">
          {report.staleReason}
        </p>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compatibility report</h2>
        {report.successProbability !== undefined && (
          <div className="text-right">
            <p className="text-3xl font-bold text-brand-600">{report.successProbability}%</p>
            <p className="text-sm text-slate-500">Success probability</p>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-600">Confidence: {report.confidenceLevel}</p>
      {report.dimensionScores && (
        <section>
          <h3 className="font-medium">Dimensions</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {Object.entries(report.dimensionScores).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-50 p-3">
                <dt className="text-sm capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="text-lg font-semibold">{(value * 100).toFixed(0)}%</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {report.explanations?.overall && (
        <section>
          <h3 className="font-medium">Summary</h3>
          <p className="mt-1 text-sm text-slate-600">{report.explanations.overall}</p>
        </section>
      )}
      {report.riskFlags && report.riskFlags.length > 0 && (
        <section>
          <h3 className="font-medium">Risk flags</h3>
          <ul className="mt-2 space-y-2">
            {report.riskFlags.map((flag, i) => (
              <li key={i} className={`rounded-lg p-3 text-sm ${flag.severity === 'high' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'}`}>
                <strong className="capitalize">{flag.type.replace(/_/g, ' ')}</strong>: {flag.explanation}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
