"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className="relative inline-flex h-[24px] w-[44px]" onClick={handleClick}>
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          checked={checked}
          onChange={() => {}} // Controlled by onClick
          disabled={disabled}
          {...props}
        />
        <span className={cn(
          "absolute inset-0 cursor-pointer rounded-full bg-input transition-colors",
          "peer-checked:bg-primary peer-focus-visible:outline-none peer-focus-visible:ring-2",
          "peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )} />
        <span className={cn(
          "absolute h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          "peer-checked:translate-x-5 peer-checked:bg-white",
          "left-0 top-0 pointer-events-none"
        )} />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };