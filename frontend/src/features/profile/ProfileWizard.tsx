'use client';

import { useState } from 'react';
import { SkillsStep } from './steps/SkillsStep';
import { AssessmentStep } from './steps/AssessmentStep';
import { GoalsStep } from './steps/GoalsStep';
import { PastProjectsStep } from './steps/PastProjectsStep';

const STEPS = ['skills', 'assessment', 'goals', 'projects'] as const;

export function ProfileWizard() {
  const [step, setStep] = useState(0);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <div>
      <nav aria-label="Profile setup progress" className="mb-6 flex gap-2">
        {STEPS.map((name, i) => (
          <span
            key={name}
            className={`rounded-full px-3 py-1 text-sm ${i === step ? 'bg-brand-600 text-white' : i < step ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-600'}`}
          >
            {i + 1}. {name}
          </span>
        ))}
      </nav>
      {step === 0 && <SkillsStep onComplete={next} />}
      {step === 1 && <AssessmentStep onComplete={next} />}
      {step === 2 && <GoalsStep onComplete={next} />}
      {step === 3 && <PastProjectsStep onComplete={() => (window.location.href = '/profile')} />}
    </div>
  );
}
