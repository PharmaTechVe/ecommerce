'use client';
export type ProgressBarVariant = 'simple' | 'bubble' | 'inline';
export interface ProgressBarProps {
  value: number;
  width?: string;
  height?: string;
  color?: string;
  backgroundColor?: string;
  labelColor?: string;
  bubbleSize?: string;
  bubbleMarginTop?: string;
  bubbleTriangleSize?: number;
  variant?: ProgressBarVariant;
  className?: string;
}

export const ProgressBar = ({
  value,
  width,
  height,
  color,
  backgroundColor,
  labelColor,
  bubbleSize,
  bubbleMarginTop,
  bubbleTriangleSize,
  variant,
  className = '',
}: ProgressBarProps) => {
  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div
        className="w-full rounded-full"
        style={{
          height,
          backgroundColor: backgroundColor,
        }}
      >
        <div
          className="rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${progressValue}%`,
            height,
            backgroundColor: color,
          }}
        >
          {variant === 'inline' && (
            <div
              className="flex h-full items-center justify-center text-xs font-medium"
              style={{
                color: labelColor,
                minWidth: bubbleSize,
              }}
            >
              {progressValue}%
            </div>
          )}
        </div>
      </div>

      {variant === 'bubble' && (
        <div
          className="absolute flex items-center justify-center rounded text-xs font-medium"
          style={{
            top: `-${bubbleMarginTop}`,
            left: `calc(${progressValue}% - (${bubbleSize} / 2))`,
            backgroundColor: color,
            minWidth: bubbleSize,
            color: labelColor,
            padding: '0.25rem 0.5rem',
          }}
        >
          <div className="relative">
            {progressValue}%
            <div
              className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2"
              style={{
                borderLeft: `${bubbleTriangleSize}px solid transparent`,
                borderRight: `${bubbleTriangleSize}px solid transparent`,
                borderTop: `${bubbleTriangleSize}px solid ${color}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
