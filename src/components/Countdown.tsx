"use client";

import { useEffect, useState } from "react";

const OSCAR_DATE = new Date("2026-03-15T22:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const diff = OSCAR_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: "dias" },
    { value: timeLeft.hours, label: "horas" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "seg" },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {blocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="glass-card-bright rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl sm:text-3xl font-display text-golden">
              {String(block.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs sm:text-sm text-white/60 mt-1 font-body font-semibold uppercase tracking-wider">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
