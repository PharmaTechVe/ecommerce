'use client';
import React, { useState } from 'react';

type StepperProps = {
  steps: string[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  borderColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  stepSize?: number;
  lineColor?: string;
  lineSize?: number;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  initialStep = 0,
  onStepChange,
  borderColor = '#1E1E1E',
  backgroundColor = '#FFFFFF',
  labelColor = '#1E1E1E',
  stepSize = 40,
  lineColor = '#1E1E1E',
  lineSize = 2,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    console.log('Step selected:', index + 1);
    if (onStepChange) onStepChange(index);
  };

  return (
    <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow-md">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {index !== 0 && (
            <div
              className="mb-10"
              style={{
                backgroundColor: index <= currentStep ? borderColor : lineColor,
                width: `${lineSize}px`,
                height: '2px',
                marginTop: `${stepSize / 2 - 1}px`,
              }}
            ></div>
          )}
          <div
            className="flex cursor-pointer flex-col items-center"
            onClick={() => handleStepClick(index)}
          >
            <div
              className="flex items-center justify-center rounded-full border"
              style={{
                width: stepSize,
                height: stepSize,
                backgroundColor:
                  index === currentStep ? borderColor : backgroundColor,
                borderColor: borderColor,
                color: index === currentStep ? backgroundColor : borderColor,
                fontWeight: 'bold',
              }}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm" style={{ color: labelColor }}>
              {step}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
