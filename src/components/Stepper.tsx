'use client';
import React from 'react';
import theme from '@/styles/styles';

type StepperProps = {
  steps: string[];
  currentStep: number;
  stepSize: number;
  clickable?: boolean;
  onStepChange?: (step: number) => void;
};

export default function Stepper({
  steps,
  currentStep,
  stepSize,
  clickable = false,
  onStepChange,
}: StepperProps) {
  const primary = theme.Colors.primary;
  const mainTextColor = theme.Colors.textMain;
  const b1Size = theme.FontSizes.b1.size;

  const totalSteps = steps.length;

  return (
    <div style={{ position: 'relative', width: '100%', padding: '16px 0' }}>
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: `${50 / totalSteps}%`,
          right: `${50 / totalSteps}%`,
          height: 2,
          backgroundColor: primary,
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {steps.map((stepLabel, index) => {
          const stepIndex = index + 1;
          const isActive = currentStep >= stepIndex;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                onClick={() => {
                  if (clickable && onStepChange) {
                    onStepChange(index);
                  }
                }}
                style={{
                  width: stepSize,
                  height: stepSize,
                  borderRadius: stepSize / 2,
                  border: `2px solid ${primary}`,
                  backgroundColor: isActive ? primary : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#fff' : primary,
                  fontWeight: 'bold',
                  cursor: clickable ? 'pointer' : 'default',
                }}
              >
                {stepIndex}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: b1Size,
                  textAlign: 'center',
                  color: mainTextColor,
                  fontWeight: 400,
                }}
              >
                {stepLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
