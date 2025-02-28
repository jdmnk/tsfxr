"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

// Context remains unchanged
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

// Define props for single selection mode
type ToggleGroupSingleProps = {
  value?: string;
  onValueChange?: (value: string) => void;
};

// Use type alias with intersection, omitting conflicting props
type ToggleGroupProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "onValueChange" | "defaultValue" // Omit defaultValue too
> &
  VariantProps<typeof toggleVariants> &
  ToggleGroupSingleProps;

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    { className, variant, size, children, value, onValueChange, ...props },
    ref
  ) => {
    const [controlledValue, setControlledValue] = React.useState(value || "");

    // Sync internal state with external value prop (for controlled usage)
    React.useEffect(() => {
      if (value !== undefined) {
        setControlledValue(value);
      }
    }, [value]);

    const handleValueChange = (newValue: string) => {
      // If the new value is the same as the current value, do nothing
      if (newValue === controlledValue) {
        return;
      }

      // Update internal state and call onValueChange if provided
      if (newValue) {
        setControlledValue(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      }
    };

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        type="single" // Hardcoded single selection
        value={controlledValue} // Single string
        onValueChange={handleValueChange} // Handler for single string
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }
);

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
