'use client';
import { useState } from 'react';
import Stepper from '@/components/Stepper';

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    console.log('Step selected:', index + 1);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Stepper
        steps={['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']}
        initialStep={currentStep}
        onStepChange={handleStepClick}
        borderColor="#1C2143"
        backgroundColor="#FFFFFF"
        labelColor="#1E1E1E"
        stepSize={50}
        lineColor="#1C2143"
        lineSize={50}
        marginBottom={50} // Si se modifica stepSize se debe modificar marginBottom
      />
    </div>
  );
}
