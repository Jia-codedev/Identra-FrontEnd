import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
      <svg
        className="animate-spin-slow drop-shadow-md"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
      >
        <circle
          cx="18"
          cy="18"
          r="14"
          stroke="var(--color-primary, #e758fd)"
          strokeWidth="4"
          strokeDasharray="22 44"
          strokeLinecap="round"
          opacity="0.18"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          stroke="var(--color-primary, #e758fd)"
          strokeWidth="4"
          strokeDasharray="22 44"
          strokeLinecap="round"
          className="[stroke-dashoffset:0] animate-loader-stroke"
        />
      </svg>
      <span className="mt-3 text-sm font-medium tracking-wide text-muted dark:text-primary/80 drop-shadow-sm">
        Loading dashboard...
      </span>
    </div>
  );
};

export default Loading;
