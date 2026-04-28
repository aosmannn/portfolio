'use client';

import { useEffect, useRef, useState } from 'react';
import { sounds } from '@/lib/sounds';

const STATUS_MESSAGES = [
  'Initializing system...',
  'Loading portfolio...',
  'Mounting projects...',
  'Calibrating experience...',
  'Starting desktop...',
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 3.33;
        if (next >= 100 && !doneRef.current) {
          doneRef.current = true;
          clearInterval(interval);
          setTimeout(() => {
            sounds.startup();
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 100);
          return 100;
        }
        // Cycle status messages
        setStatusIndex(Math.floor((next / 100) * STATUS_MESSAGES.length));
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="boot-screen">

      <div className="boot-progress-track">
        <div
          className="boot-progress-bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="boot-text">
        {STATUS_MESSAGES[Math.min(statusIndex, STATUS_MESSAGES.length - 1)]}
      </div>
    </div>
  );
}
