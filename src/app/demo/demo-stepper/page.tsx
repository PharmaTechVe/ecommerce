'use client';
import Stepper from '@/components/Stepper';

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Stepper
        steps={['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']}
        initialStep={0}
        borderColor="#1C2143"
        backgroundColor="#FFFFFF"
        labelColor="#1E1E1E"
        stepSize={40}
        lineColor="#1C2143"
        lineSize={50}
      />
    </div>
  );
}
