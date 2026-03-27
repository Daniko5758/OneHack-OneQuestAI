'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  fire: boolean;
}

export default function Confetti({ fire }: ConfettiProps) {
  const shootConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#00f0ff', '#8b5cf6', '#ff00e5', '#00ff88'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big center burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
      startVelocity: 30,
    });
  }, []);

  useEffect(() => {
    if (fire) {
      shootConfetti();
    }
  }, [fire, shootConfetti]);

  return null;
}
