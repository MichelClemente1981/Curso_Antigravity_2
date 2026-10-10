import React from "react";

interface AlertProps {
  type: "error" | "success" | "info";
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  const baseClasses = "p-4 mb-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const typeClasses = {
    error: "bg-red-50 text-red-800 border border-red-200 focus:ring-red-500",
    success: "bg-green-50 text-green-800 border border-green-200 focus:ring-green-500",
    info: "bg-blue-50 text-blue-800 border border-blue-200 focus:ring-blue-500",
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]}`} 
      role="alert" 
      aria-live="polite"
      tabIndex={-1}
    >
      {message}
    </div>
  );
}
