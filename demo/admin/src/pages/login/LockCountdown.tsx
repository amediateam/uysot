import { useEffect, useState } from "react";

// Countdown shown while login is locked (recovered from the build). Renders mm:ss and
// calls onFinish when it reaches zero.
export const LockCountdown = ({ seconds, onFinish }: { seconds: number; onFinish: () => void }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onFinish();
      return;
    }
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, onFinish]);

  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const secs = String(Math.max(0, remaining) % 60).padStart(2, "0");
  return <span className="font-medium tabular-nums">{`${minutes}:${secs}`}</span>;
};
