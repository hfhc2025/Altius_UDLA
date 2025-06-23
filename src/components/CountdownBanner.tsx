'use client';
import { useEffect, useState } from 'react';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const end = new Date('2026-02-20T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl p-4 bg-white text-center shadow ring-1 ring-gray-200">
      <p>
        🎓 El proceso de admisión continúa el{' '}
        <strong>martes 20 de febrero de 2026</strong>
      </p>
      <div className="text-lg font-semibold text-orange-600 tracking-wide">
        {timeLeft.days}d&nbsp;
        {String(timeLeft.hours).padStart(2, '0')}h&nbsp;
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
    </div>
  );
}