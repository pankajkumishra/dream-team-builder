'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '../profile.api';

interface Question {
  id: string;
  text: string;
}

export function AssessmentStep({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileApi.getAssessment().then((data) => {
      setQuestions((data.questions as Question[]) ?? []);
      setResponses((data.responses as Record<string, number>) ?? {});
    });
  }, []);

  async function handleSubmit() {
    setSaving(true);
    await profileApi.updateAssessment({ responses, submit: true });
    setSaving(false);
    onComplete();
  }

  async function handleSkip() {
    await profileApi.skipAssessment();
    onComplete();
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Work-style assessment</h2>
      <p className="text-sm text-slate-600">Rate how much you agree (1 = disagree, 5 = agree)</p>
      {questions.map((q) => (
        <fieldset key={q.id} className="space-y-2">
          <legend className="text-sm font-medium">{q.text}</legend>
          <div className="flex gap-2" role="radiogroup" aria-label={q.text}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex cursor-pointer items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={q.id}
                  value={n}
                  checked={responses[q.id] === n}
                  onChange={() => setResponses({ ...responses, [q.id]: n })}
                />
                {n}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary">
          {saving ? 'Submitting...' : 'Submit assessment'}
        </button>
        <button type="button" onClick={handleSkip} className="btn-secondary">
          Skip for now
        </button>
      </div>
    </div>
  );
}
