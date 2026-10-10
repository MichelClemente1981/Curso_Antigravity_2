import React, { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputId = useId();
    const errorId = `${inputId}-error`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
            ${error ? "border-red-500" : "border-gray-300"}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span id={errorId} className="text-sm text-red-600 font-medium" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
