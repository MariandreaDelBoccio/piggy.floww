import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
  borderSize?: number;
  fullscreen?: boolean;
}

export default function Spinner({
  size = 32,
  color = "#6366f1",
  borderSize = 4,
  fullscreen = false,
}: SpinnerProps) {
  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    border: `${borderSize}px solid #e5e7eb`,
    borderTop: `${borderSize}px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const wrapperStyle: React.CSSProperties = fullscreen
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.75)",
        zIndex: 1000,
      }
    : {};

  return (
    <>
      <div style={wrapperStyle}>
        <div style={spinnerStyle} role="status" aria-label="loading" />
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
