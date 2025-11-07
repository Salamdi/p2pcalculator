import { PointerEventHandler, useRef } from "react";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";

type HoldButtonProps = {
  onHold?: () => void;
  initialDelay?: number;
  minDelay?: number;
  accelFactor?: number;
  accelInterval?: number;
} & React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function HoldButton({
  onHold,
  initialDelay = 300,   // delay before first repeat
  minDelay = 20,         // lowest delay cap
  accelFactor = 0.5,     // each step is 50% faster
  accelInterval = 200,   // accelerate every 200ms
  children,
  ...props
}: HoldButtonProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const startTimeRef = useRef(0);
  const currentDelayRef = useRef(initialDelay);

  const step = () => {
    onHold?.();

    const elapsed = Date.now() - startTimeRef.current;
    // accelerate every accelInterval ms
    const accelSteps = Math.floor(elapsed / accelInterval);
    const nextDelay = Math.max(minDelay, initialDelay * accelFactor ** accelSteps);

    currentDelayRef.current = nextDelay;
    timeoutRef.current = setTimeout(step, nextDelay);
  };

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = () => {
    onHold?.(); // fire once immediately
    startTimeRef.current = Date.now();
    currentDelayRef.current = initialDelay;
    timeoutRef.current = setTimeout(step, initialDelay);
  };

  const stop = () => {
    clearTimeout(timeoutRef.current ?? undefined);
    timeoutRef.current = null;
  };

  return (
    <Button
      {...props}
      onPointerDown={handlePointerDown}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {children}
    </Button>
  );
}
