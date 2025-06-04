'use client';
import React, { useEffect, useState } from 'react';
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

  const [responsiveStepSize, setResponsiveStepSize] = useState(stepSize);
  const [responsiveFontSize, setResponsiveFontSize] = useState(b1Size);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setResponsiveStepSize(stepSize * 0.7);
        setResponsiveFontSize(b1Size * 0.75);
      } else {
        setResponsiveStepSize(stepSize);
        setResponsiveFontSize(b1Size);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stepSize, b1Size]);

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
                  width: responsiveStepSize,
                  height: responsiveStepSize,
                  borderRadius: responsiveStepSize / 2,
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
                  fontSize: responsiveFontSize,
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
